import {MarchComponent} from "../march-component";
import {Control} from "./control";

export class ControlPanel extends MarchComponent {

    static name = 'control-panel';

    public element: HTMLDivElement;

    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});
        this.element = shadow.appendChild(document.createElement('div'));
        this.element.style.width = '256px';
        this.element.style.padding = '10vh 16px';
        this.element.style.maxHeight = '80vh';
        this.element.style.overflowY = 'auto';
    }

    connectedCallback() {
        this.update();
    }

    connectedMoveCallback() {
        this.update();
    }

    attributeChangedCallback() {
        this.update();
    }

    update() {
        this.element.innerHTML = '';
        for (let child of this.children) {
            if (child instanceof Control) {
                this.element.appendChild(child.render());
            }
        }
    }
}
