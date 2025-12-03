import {struct, vec3f} from "../byte-packing/byte-types";
import {Colour} from "../colour";
import {MarchComponent} from "../march-component";

export class Material extends MarchComponent {

    static name = 'material';
    static observedAttributes = ['ambient', 'diffuse', 'specular'];

    static struct = struct('Material', {
        ambient: vec3f,
        diffuse: vec3f,
        specular: vec3f,
    });

    public ambient: Colour = Colour.greyscale(0.125);
    public diffuse: Colour = Colour.greyscale(0.5);
    public specular: Colour = Colour.greyscale(0.875);

    static of_colour(colour: Colour): Material {
        const material = new Material();
        material.diffuse = colour;
        material.ambient = colour.darken(0.75);
        material.specular = colour.lighten(0.75);
        return material
    }

    update() {
        super.update();
        this.diffuse = this.attribute_colour('diffuse', Colour.greyscale(0.5));
        this.ambient = this.attribute_colour('ambient', this.diffuse.darken(0.75));
        this.specular = this.attribute_colour('specular', this.diffuse.lighten(0.75));
    }
}
