import {Composite} from "./composite";
import {Solid} from "../solid";

export class Difference extends Composite {

    static name = 'difference';

    child_solids(): Solid[] {
        return super.child_solids().slice(0, 2);
    }

    function_name(): string {
        return 'hit_difference';
    }
}
