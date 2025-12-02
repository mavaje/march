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

    public ambient: Colour = Colour.grey(0.125);
    public diffuse: Colour = Colour.grey(0.5);
    public specular: Colour = Colour.grey(0.875);

    update() {
        super.update();
        this.diffuse = this.attribute_colour('diffuse', Colour.grey(0.5));
        this.ambient = this.attribute_colour('ambient', this.diffuse.darken(0.75));
        this.specular = this.attribute_colour('specular', this.diffuse.lighten(0.75));
    }
}
