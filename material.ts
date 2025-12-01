import {struct, vec3f} from "./byte-packing/byte-types";
import {Colour, ColourLike} from "./colour";

export class Material {

    static struct = struct('Material', {
        ambient: vec3f,
        diffuse: vec3f,
        specular: vec3f,
    });

    public ambient: Colour;
    public diffuse: Colour;
    public specular: Colour;

    constructor(diffuse?: ColourLike);
    constructor(ambient: ColourLike, diffuse: ColourLike, specular?: ColourLike);
    constructor(...args: ColourLike[]) {
        if (args.length <= 1) {
            this.diffuse = Colour.from(args[0], new Colour(0.8, 0.1, 0.0));
            this.ambient = this.diffuse.darken(0.75);
            this.specular = this.diffuse.lighten(0.75);
        } else {
            this.ambient = Colour.from(args[0]);
            this.diffuse = Colour.from(args[1]);
            this.specular = Colour.from(args[2]);
        }
    }
}
