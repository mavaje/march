import {struct, vec3f} from "../byte-packing/byte-types";
import {Vector} from "../vector";
import {Colour, ColourLike} from "../colour";
import {MarchComponent} from "../march-component";

export class Sun extends MarchComponent {

    static name = 'sun';
    static observedAttributes = [
        'direction',
        'ambient',
        'diffuse',
        'specular',
    ];

    static struct = struct('Sun', {
        direction: vec3f,
        ambient: vec3f,
        diffuse: vec3f,
        specular: vec3f,
    });

    public direction: Vector = Vector.from([1, -1, -1]).normalised();
    public ambient: ColourLike = Colour.WHITE;
    public diffuse: ColourLike = Colour.WHITE;
    public specular: ColourLike = Colour.WHITE;

    update() {
        super.update();
        this.direction = this.attribute_vector('direction', [1, -1, -1], true);
        this.ambient = this.attribute_vector('ambient', [1, 1, 1]);
        this.diffuse = this.attribute_vector('diffuse', [1, 1, 1]);
        this.specular = this.attribute_vector('specular', [1, 1, 1]);
    }
}
