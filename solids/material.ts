import {struct, vec3f} from "../byte-packing/byte-types";

export class Material {

    static struct = struct('Material', {
        ambient: vec3f,
        diffuse: vec3f,
        specular: vec3f,
    });

    constructor(
        public ambient: DOMPoint = new DOMPoint(0.125, 0.125, 0.125),
        public diffuse: DOMPoint = new DOMPoint(0.5, 0.5, 0.5),
        public specular: DOMPoint = new DOMPoint(1, 1, 1),
    ) {}
}
