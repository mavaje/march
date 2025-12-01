import {Solid} from "./solid";
import {Material} from "../material";

export class Primitive extends Solid {

    constructor(
        public material: Material = new Material(),
    ) {
        super();
    }
}
