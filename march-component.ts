import {MarchElement} from "./march-element";
import {Marcher} from "./marcher";

export abstract class MarchComponent extends MarchElement {
    connectedCallback() {
        this.update();
        this.update_marcher();
        this.restart_marcher();
    }

    connectedMoveCallback() {
        this.restart_marcher();
    }

    disconnectedCallback() {
        this.restart_marcher();
    }

    attributeChangedCallback() {
        this.update();
        this.update_marcher();
    }

    update() {}

    update_marcher() {
        if (this.parentElement instanceof Marcher) {
            this.parentElement.render();
        } else if (this.parentElement instanceof MarchComponent) {
            this.parentElement.update_marcher();
        }
    }

    restart_marcher() {
        if (this.parentElement instanceof Marcher) {
            this.parentElement.initialise();
        } else if (this.parentElement instanceof MarchComponent) {
            this.parentElement.restart_marcher();
        }
    }
}
