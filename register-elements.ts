import {Marcher} from "./marcher";
import {Cube} from "./solid/cube";
import {Cone} from "./solid/cone";
import {Cylinder} from "./solid/cylinder";
import {Plane} from "./solid/plane";
import {Sphere} from "./solid/sphere";
import {Torus} from "./solid/torus";
import {Union} from "./solid/union";
import {Intersection} from "./solid/intersection";
import {Difference} from "./solid/difference";
import {Sun} from "./light/sun";

export function register_custom_elements() {
    [
        Union,
        Intersection,
        Difference,

        Sun,

        Cone,
        Cube,
        Cylinder,
        Plane,
        Sphere,
        Torus,

        Marcher,
    ].forEach(element => {
        window.customElements.define(`x-${element.name}`, element);
    });
}
