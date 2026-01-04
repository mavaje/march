import {Marcher} from "./marcher";
import {Cube} from "./solid/primitive/cube";
import {Cone} from "./solid/primitive/cone";
import {Cylinder} from "./solid/primitive/cylinder";
import {Plane} from "./solid/primitive/plane";
import {Sphere} from "./solid/primitive/sphere";
import {Torus} from "./solid/primitive/torus";
import {Union} from "./solid/composite/union";
import {Intersection} from "./solid/composite/intersection";
import {Difference} from "./solid/composite/difference";
import {Sun} from "./light/sun";
import { Repeat } from "./solid/composite/repeat";
import {Camera} from "./camera/camera";
import {Material} from "./material/material";
import {ControlPanel} from "./controls/control-panel";
import {Slider} from "./controls/slider";

export function register_custom_elements() {
    [
        Camera,

        Sun,

        Material,

        Union,
        Intersection,
        Difference,

        Repeat,

        Cone,
        Cube,
        Cylinder,
        Plane,
        Sphere,
        Torus,

        ControlPanel,
        Slider,

        Marcher,
    ].forEach(element => {
        window.customElements.define(`x-${element.name}`, element);
    });
}
