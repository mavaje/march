import {array, struct_declaration} from "./byte-packing/byte-types";
import {Frame} from "./frame";
import {Controls} from "./controls";
import {Config} from "./config";
import {Sphere} from "./solids/sphere";
import {Solid} from "./solids/solid";
import {Composite} from "./solids/composite";
import {Plane} from "./solids/plane";
import {Cube} from "./solids/cube";
import {Cylinder} from "./solids/cylinder";
import {Cone} from "./solids/cone";
import { Torus } from "./solids/torus";

type Binding = {
    index: number;
    buffer?: GPUBuffer;
};

const SOLID_TYPES = [
    Composite,
    Plane,
    Cube,
    Sphere,
    Cylinder,
    Cone,
    Torus,
];

export class Marcher {

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
                frame: {index: 2} as Binding,
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

    private context: GPUCanvasContext = null;
    private device: GPUDevice = null;
    private pipeline: GPUComputePipeline = null;

    public canvas: HTMLCanvasElement;

    public config = new Config();

    public controls: Controls = new Controls();

    public root_solid: Solid = null;
    public solids: Record<string, Solid[]> = {};

    public frame = new Frame();

    constructor(
        public width: number,
        public height: number,
    ) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;

        let rotating: DOMPoint = null;
        this.canvas.addEventListener('pointerdown', ({x, y}: PointerEvent) => rotating = new DOMPoint(x, y));
        document.addEventListener('pointerup', () => rotating = null);

        document.addEventListener('pointermove', ({x, y}) => {
            if (rotating) {
                this.config.view_altitude += (y - rotating.y) / 100;
                this.config.view_azimuth -= (x - rotating.x) / 100;
                rotating = new DOMPoint(x, y);
            }
        });

        this.load_model(
            Composite.union(
                new Cube(),
                new Torus(),
            ),
        );

        this.controls.reading(
            'FPS',
            () => Math.round(1000 / this.frame.delta),
        );

        this.controls.field_slider('ambient light level', this.config, 'ambient_light', 0, 1);
        this.controls.field_slider('diffuse light level', this.config, 'diffuse_light', 0, 1);
        this.controls.field_slider('specular light level', this.config, 'specular_light', 0, 1);
        this.controls.field_checkbox('shadows', this.config, 'shadows');
        this.controls.field_slider('sun azimuth', this.config, 'sun_azimuth', -Math.PI, Math.PI);
        this.controls.field_slider('sun altitude', this.config, 'sun_altitude', -Math.PI / 2, Math.PI / 2);

        Object.entries({
            composite: {
                smoothing: [0, 1],
            },
            plane: {
                distance: [-1, 1],
            },
            cube: {
                'centre.x': [-1, 1],
                radius: [0, 1],
            },
            sphere: {
                radius: [0, 1],
            },
            cylinder: {
                radius: [0, 1],
            },
            cone: {
                angle: [0, Math.PI / 2],
            },
            torus: {
                radius_major: [0, 1],
                radius_minor: [0, 1],
            },
        }).forEach(([type, fields]) => {
            this.solids[type]?.forEach((solid: Solid, i) => {
                Object.entries(fields).forEach(([field, range]) => {
                    this.controls.field_slider(`${solid.name()} ${i} ${field}`, solid, field, ...range);
                });
            });
        });
    }

    async initialise() {
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
                this.initialise();
            }
        });

        const format = supports_bgra
            ? navigator.gpu.getPreferredCanvasFormat()
            : 'rgba8unorm';

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
            code: this.load_code()
                .replaceAll('canvas_width', `${this.width}`)
                .replaceAll('canvas_height', `${this.height}`)
                .replaceAll('canvas_area', `${this.width * this.height}`)
                .replaceAll('canvas_format', format),
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
                {
                    binding: this.groups.global.bindings.frame.index,
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

        this.groups.global.bindings.frame.buffer = this.device.createBuffer({
            label: `frame buffer`,
            size: Frame.struct.size,
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

    load_model(solid: Solid, is_root = true) {
        this.solids[solid.name()] ??= [];
        this.solids[solid.name()].push(solid);

        if (solid instanceof Composite) {
            this.load_model(solid.solid_a, false);
            this.load_model(solid.solid_b, false);
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

            this.frame.solid_count = i;
        }
    }

    load_code(): string {
        let code: string =[
            require('./wgsl/global.wgsl'),
            require('./wgsl/render.wgsl'),
        ].join('\n');

        SOLID_TYPES.forEach(solid => {
            const name = new solid().name();
            const struct_name = name[0].toUpperCase() + name.slice(1);

            code += struct_declaration(struct_name, new solid().struct());

            code += `@group(solids) @binding(${name})\n`;
            code += `var<uniform> ${name}_list: array<${struct_name}, max_typed_solid_count>;\n`;

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

        code = code.replace(
            'HIT_INJECTION',
            this.root_solid.hit_code(),
        );

        return code;
    }

    render() {

        this.device.queue.writeBuffer(
            this.groups.global.bindings.config.buffer,
            0,
            this.config.buffer(),
        );

        this.device.queue.writeBuffer(
            this.groups.global.bindings.frame.buffer,
            0,
            this.frame.buffer(),
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
                {
                    binding: this.groups.global.bindings.frame.index,
                    resource: {buffer: this.groups.global.bindings.frame.buffer},
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
            Math.floor(this.width / this.const.render_workgroup_size[0]),
            Math.floor(this.height / this.const.render_workgroup_size[1]),
        );

        pass.end();

        this.device.queue.submit([encoder.finish()]);
    }

    render_cycle(time: number = 0) {
        this.frame.increment(time);
        this.render();
        requestAnimationFrame(time => this.render_cycle(time));
    }
}
