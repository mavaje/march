import {Control} from "./control";
import {Solid} from "../solid/solid";

export class Slider extends Control {

    static name = 'slider';
    static observedAttributes = [
        'label',
        'for',
        'attribute',
        'min',
        'max',
        'step',
    ];

    render() {
        const control = super.render();

        const target = this.attribute_reference('for', Solid as any);
        const attribute = this.getAttribute('attribute');
        const label_text = this.getAttribute('label') ?? attribute;
        const id = `slider-${target.name()}-${attribute}`;

        const min = this.attribute_numeric('min', null);
        const max = this.attribute_numeric('max', null);
        const step = this.attribute_numeric('step', null);

        const label = control.appendChild(document.createElement('label'));
        label.innerText = label_text;
        label.htmlFor = id;

        const input = control.appendChild(document.createElement('input'));
        input.style.fontFamily = 'monospace';
        input.style.color = 'white';
        input.style.backgroundColor = 'black';
        input.style.outline = 'none';
        input.style.border = 'none';
        input.style.width = '25%';
        input.style.textAlign = 'right';
        input.type = 'number';
        input.id = id;
        input.name = attribute;
        input.step = String(step ?? 'any');
        input.value = String(target[attribute]);
        input.addEventListener('input', () => {
            slider.value = input.value;
            target.setAttribute(attribute, input.value);
        });

        const slider = control.appendChild(document.createElement('input'));
        slider.style.flex = '0 0 100%';
        slider.type = 'range';
        slider.name = attribute;
        slider.min = String(min);
        slider.max = String(max);
        slider.step = String(step ?? 'any');
        slider.value = String(target[attribute]);
        slider.addEventListener('input', () => {
            input.value = slider.value;
            target.setAttribute(attribute, input.value);
        });

        return control;
    }
}
