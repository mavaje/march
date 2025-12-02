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
        if (this.parentElement instanceof Marcher) {
            return this.parentElement;
        } else if (this.parentElement instanceof MarchComponent) {
            this.parentElement.root_marcher();
        } else {
            return null;
        }
    }
}
