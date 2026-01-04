import {MarchComponent} from "../march-component";
import {ControlPanel} from "./control-panel";

export abstract class Control extends MarchComponent {

    public element: HTMLDivElement;

    connectedCallback() {
        this.control_panel().update();
    }

    connectedMoveCallback() {
        this.control_panel().update();
    }

    attributeChangedCallback() {
        this.control_panel().update();
    }

    control_panel(): ControlPanel {
        const panel = this.closest('x-control-panel');
        return (panel instanceof ControlPanel) ? panel : null;
    }

    render(): HTMLDivElement {
        const control = document.createElement('div');
        control.style.color = 'white';
        control.style.minHeight = '24px';
        control.style.marginBottom = '8px';
        control.style.display = 'flex';
        control.style.flexDirection = 'row';
        control.style.flexWrap = 'wrap';
        control.style.alignItems = 'centre';
        control.style.justifyContent = 'space-between';
        return control;
    }
}
