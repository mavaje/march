import {MarchElement} from "./march-element";
import {Marcher} from "./marcher";

export abstract class MarchComponent extends MarchElement {
    connectedCallback() {
        this.update();
        this.root_marcher()?.initialise();
    }

    connectedMoveCallback() {
        this.root_marcher()?.initialise();
    }

    disconnectedCallback() {
        this.root_marcher()?.initialise();
    }

    attributeChangedCallback() {
        this.update();
        this.root_marcher()?.render();
    }

    update() {}

    root_marcher(): Marcher {
        const marcher = this.closest('x-marcher');
        return (marcher instanceof Marcher) ? marcher : null;
    }
}
