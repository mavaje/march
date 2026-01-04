import {array, struct_declaration} from "./byte-packing/byte-types";
import {Config} from "./config";
import {Sphere} from "./solid/primitive/sphere";
import {Solid} from "./solid/solid";
import {Composite} from "./solid/composite/composite";
import {Plane} from "./solid/primitive/plane";
import {Cube} from "./solid/primitive/cube";
import {Cylinder} from "./solid/primitive/cylinder";
import {Cone} from "./solid/primitive/cone";
import { Torus } from "./solid/primitive/torus";
import {Material} from "./material/material";
import {Sun} from "./light/sun";
import {Union} from "./solid/composite/union";
import {Intersection} from "./solid/composite/intersection";
import {Difference} from "./solid/composite/difference";
import {MarchElement} from "./march-element";
import {Repeat} from "./solid/composite/repeat";
import {Camera} from "./camera/camera";
import {Vector} from "./vector";

type Binding = {
    index: number;
    buffer?: GPUBuffer;
};

const SOLID_TYPES = [
    Union,
    Intersection,
    Difference,
    Repeat,
    Plane,
    Cube,
    Sphere,
    Cylinder,
    Cone,
    Torus,
];

export class Marcher extends MarchElement {

    static name = 'marcher';
    static observedAttributes = [
        'width',
        'height',
    ];

    private const = {
        render_workgroup_size: [16, 16],
        max_solid_count: 2 ** 6,
        max_typed_solid_count: 2 ** 4,
    };

    private groups = {
        global: {
            index: 0,
            bindings: {
                texture: {index: 0} as Binding,
                config: {index: 1} as Binding,
            }
        },
        solids: {
            index: 1,
            bindings: {
                ...Object.fromEntries(SOLID_TYPES.map((Solid, index) => [
                    Solid.name,
                    {index} as Binding,
                ])),
            }
        },
    }

    private canvas: HTMLCanvasElement;
    private context: GPUCanvasContext = null;
    private device: GPUDevice = null;
    private pipeline: GPUComputePipeline = null;

    public config = new Config();

    public root_solid: Solid = null;
    public solids: Record<string, Solid[]> = {};

    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        this.canvas =  shadow.appendChild(document.createElement('canvas'));
        this.canvas.style.display = 'block';

        let rotating: DOMPoint = null;
        this.canvas.addEventListener('pointerdown', ({x, y}) => rotating = new DOMPoint(x, y));
        document.addEventListener('pointerup', () => rotating = null);

        document.addEventListener('pointermove', ({x, y}) => {
            if (rotating) {
                let [azimuth, altitude] = this.config.camera.direction.angular();

                azimuth -= (x - rotating.x) / 100;
                altitude -= (y - rotating.y) / 100;
                altitude = Math.max(Math.min(altitude, Math.PI / 2), -Math.PI / 2);

                this.config.camera.direction = Vector.from_angular(azimuth, altitude);
                this.config.camera.origin = this.config.camera.direction.negative().normalised().scaled(this.config.camera.origin.length());

                this.config.sun.direction = Vector.from_angular(
                    azimuth - Math.PI / 4,
                    altitude,
                );

                rotating = new DOMPoint(x, y);
                this.render();
            }
        });
    }

    connectedCallback() {
        this.initialise();
    }

    connectedMoveCallback() {
        this.initialise();
    }

    attributeChangedCallback() {
        this.initialise();
    }

    private async setup() {
        if (!navigator.gpu) {
            throw new Error('WebGPU not supported');
        }

        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            throw new Error('No GPU adapters found');
        }

        const supports_bgra = adapter.features.has('bgra8unorm-storage');

        this.device = await adapter.requestDevice({
            requiredFeatures: supports_bgra ? ['bgra8unorm-storage'] : [],
        });
        this.device.lost.then(info => {
            console.error(`WebGPU device lost: ${info.message}`);

            if (info.reason !== 'destroyed') {
                this.setup();
            }
        });

        const format = supports_bgra
            ? navigator.gpu.getPreferredCanvasFormat()
            : 'rgba8unorm';

        this.canvas.width = this.attribute_numeric('width', 512);
        this.canvas.height = this.attribute_numeric('height', 512);

        this.context = this.canvas.getContext('webgpu');
        this.context.configure({
            device: this.device,
            format,
            alphaMode: 'premultiplied',
            usage: GPUTextureUsage.TEXTURE_BINDING
                | GPUTextureUsage.STORAGE_BINDING
                | GPUTextureUsage.COPY_DST,
        });

        const module = this.device.createShaderModule({
            label: 'module',
            code: this.load_code({canvas_format: format}),
        });

        const global_bind_group_layout = this.device.createBindGroupLayout({
            label: 'global bind group layout',
            entries: [
                {
                    binding: this.groups.global.bindings.texture.index,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {
                        access: 'write-only',
                        format,
                    },
                },
                {
                    binding: this.groups.global.bindings.config.index,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {type: 'uniform'},
                },
            ],
        });

        const frame_bind_group_layout = this.device.createBindGroupLayout({
            label: 'frame bind group layout',
            entries: Object.values(this.groups.solids.bindings).map(binding => ({
                binding: binding.index,
                visibility: GPUShaderStage.COMPUTE,
                buffer: {type: 'uniform'},
            })),
        });

        const render_pipeline_layout = this.device.createPipelineLayout({
            label: 'render pipeline layout',
            bindGroupLayouts: [
                global_bind_group_layout,
                frame_bind_group_layout,
            ],
        });

        this.pipeline = this.device.createComputePipeline({
            label: 'render pipeline',
            layout: render_pipeline_layout,
            compute: {
                module: module,
                entryPoint: 'render',
            },
        });

        this.groups.global.bindings.config.buffer = this.device.createBuffer({
            label: `config buffer`,
            size: Config.struct.size,
            usage: GPUBufferUsage.UNIFORM
                | GPUBufferUsage.COPY_DST,
        });

        SOLID_TYPES.forEach(solid => {
            this.groups.solids.bindings[solid.name].buffer = this.device.createBuffer({
                label: `${solid.name} buffer`,
                size: array(new solid().struct(), this.const.max_typed_solid_count).size,
                usage: GPUBufferUsage.UNIFORM
                    | GPUBufferUsage.COPY_DST,
            });
        });
    }

    private load_model(solid: Solid, is_root = true) {
        if (is_root) {
            this.solids = {};
        }

        this.solids[solid.name()] ??= [];
        this.solids[solid.name()].push(solid);

        if (solid instanceof Composite) {
            solid.child_solids()
                .forEach(solid => this.load_model(solid, false));
        }

        if (solid instanceof Repeat) {
            this.load_model(solid.child(), false);
        }

        if (is_root) {
            this.root_solid = solid;

            let i = 0;
            Object.values(this.solids).forEach(solids => {
                solids.forEach((solid: Solid, j) => {
                    solid.index = j;
                    i++;
                });
            });
        }
    }

    private load_code(replacements: Record<string, string> = {}): string {
        let code: string =[
            require('./wgsl/global.wgsl'),
            require('./wgsl/render.wgsl'),
        ].join('\n');

        const declared_structs: string[] = [];

        [
            Camera,
            Sun,
            Config,
            Material,
        ].forEach(({struct}) => {
            if (!declared_structs.includes(struct.struct_name)) {
                code += struct_declaration(struct);
                declared_structs.push(struct.struct_name);
            }
        });

        SOLID_TYPES.forEach(solid_type => {
            const solid = new solid_type();
            const name = solid.name();
            const struct = solid.struct();

            if (!declared_structs.includes(struct.struct_name)) {
                code += struct_declaration(struct);
                declared_structs.push(struct.struct_name);
            }

            if (name in this.solids) {
                code += `@group(solids) @binding(${name})\n`;
                code += `var<uniform> ${name}_list: array<${struct.struct_name}, ${this.solids[name].length}>;\n`;
            }

            code += require(`./wgsl/solid/${name}.wgsl`);
        });

        Object.entries(this.const)
            .forEach(([name, value]) => {
                code = code.replaceAll(
                    name,
                    `${value}`,
                );
            });

        Object.entries(this.groups)
            .forEach(([group, {index, bindings}]) => {
                code = code.replaceAll(
                    `@group(${group})`,
                    `@group(${index})`,
                );

                Object.entries(bindings)
                    .forEach(([binding, {index}]) => {
                        code = code.replaceAll(
                            `@binding(${binding})`,
                            `@binding(${index})`,
                        );
                    });
            });

        Object.entries(replacements)
            .forEach(([target, replacement]) => {
                code = code.replaceAll(target, replacement);
            });

        return code
            .replaceAll('HIT_INJECTION', this.root_solid.hit_code())
            .replaceAll('canvas_width', `${this.canvas.width}`)
            .replaceAll('canvas_height', `${this.canvas.height}`)
            .replaceAll('canvas_area', `${this.canvas.width * this.canvas.height}`);
    }

    render_frame() {
        this.device.queue.writeBuffer(
            this.groups.global.bindings.config.buffer,
            0,
            this.config.buffer(),
        );

        Object.entries(this.solids).forEach(([type, solids]: [string, Solid[]]) => {
            solids.forEach(solid => {
                this.device.queue.writeBuffer(
                    this.groups.solids.bindings[type].buffer,
                    solid.index * solid.struct().size,
                    solid.buffer(),
                );
            });
        });

        const global_bind_group = this.device.createBindGroup({
            label: 'global bind group',
            layout: this.pipeline.getBindGroupLayout(this.groups.global.index),
            entries: [
                {
                    binding: this.groups.global.bindings.texture.index,
                    resource: this.context.getCurrentTexture().createView(),
                },
                {
                    binding: this.groups.global.bindings.config.index,
                    resource: {buffer: this.groups.global.bindings.config.buffer},
                },
            ],
        });

        const frame_bind_group = this.device.createBindGroup({
            label: 'frame bind group',
            layout: this.pipeline.getBindGroupLayout(this.groups.solids.index),
            entries: [
                ...Object.values(this.groups.solids.bindings).map(binding => ({
                    binding: binding.index,
                    resource: {buffer: binding.buffer},
                })),
            ],
        });

        const encoder = this.device.createCommandEncoder({
            label: 'command encoder',
        });

        const pass = encoder.beginComputePass({
            label: 'compute pass',
        });

        pass.setBindGroup(this.groups.global.index, global_bind_group);
        pass.setBindGroup(this.groups.solids.index, frame_bind_group);

        pass.setPipeline(this.pipeline);
        pass.dispatchWorkgroups(
            Math.floor(this.canvas.width / this.const.render_workgroup_size[0]),
            Math.floor(this.canvas.height / this.const.render_workgroup_size[1]),
        );

        pass.end();

        this.device.queue.submit([encoder.finish()]);
    }

    initialise() {
        for (let child of this.children) {
            if (child instanceof Camera) {
                this.config.camera = child;
            }

            if (child instanceof Sun) {
                this.config.sun = child;
            }

            if (child instanceof Solid) {
                this.load_model(child);
            }
        }

        if (!this.config.camera) {
            this.config.camera = new Camera();
            this.config.camera.origin = this.config.camera.origin.scaled(this.root_solid.scale());
            this.config.camera.width = this.config.camera.height = this.root_solid.scale();
        }

        this.config.sun ??= new Sun();

        this.setup().then(() => this.render());
    }

    private render_frame_id = null;
    render() {
        window.cancelAnimationFrame(this.render_frame_id);
        this.render_frame_id = window.requestAnimationFrame(() => this.render_frame());
    }
}
