import {dot_assign, dot_read} from "./dot";

export class Controls {

    public element: HTMLDivElement;

    constructor() {
        this.element = document.createElement('div');
        this.element.classList.add('control-panel');
    }

    reading(
        name: string,
        read: () => number,
    ) {
        const control = this.element.appendChild(document.createElement('div'));
        control.classList.add('control');

        const label = control.appendChild(document.createElement('label'));
        label.classList.add('control-label');
        label.innerText = name;
        label.htmlFor = name;

        const input = control.appendChild(document.createElement('input'));
        input.classList.add('control-input');
        input.type = 'number';
        input.name = name;
        input.disabled = true;

        const update_cycle = () => {
            input.value = String(read());
            setTimeout(update_cycle, 400);
        }
        update_cycle();
    }

    checkbox(
        name: string,
        value: boolean,
        on_change: (value: boolean) => void,
    ) {
        const control = this.element.appendChild(document.createElement('div'));
        control.classList.add('control');

        const label = control.appendChild(document.createElement('label'));
        label.classList.add('control-label');
        label.innerText = name;
        label.htmlFor = name;

        const input = control.appendChild(document.createElement('input'));
        input.classList.add('control-check');
        input.type = 'checkbox';
        input.id = name;
        input.name = name;
        input.checked = value;
        input.addEventListener('input', () => {
            on_change(input.checked);
        });
    }

    field_checkbox(
        name: string,
        object: object,
        key: string,
    ) {
        return this.checkbox(
            name,
            dot_read(object, key),
            value => dot_assign(object, key, value),
        );
    }

    slider(
        name: string,
        value: number,
        on_change: (value: number) => void,
        min: number = 0,
        max: number = value * 2,
        step: number = null,
    ) {
        const control = this.element.appendChild(document.createElement('div'));
        control.classList.add('control');

        const label = control.appendChild(document.createElement('label'));
        label.classList.add('control-label');
        label.innerText = name;
        label.htmlFor = name;

        const input = control.appendChild(document.createElement('input'));
        input.classList.add('control-input');
        input.type = 'number';
        input.id = name;
        input.name = name;
        input.step = String(step ?? 'any');
        input.value = String(value);
        input.addEventListener('input', () => {
            slider.value = input.value;
            on_change(Number(input.value));
        });

        const slider = control.appendChild(document.createElement('input'));
        slider.classList.add('control-slider');
        slider.type = 'range';
        slider.name = name;
        slider.min = String(min);
        slider.max = String(max);
        slider.step = String(step ?? 'any');
        slider.value = String(value);
        slider.addEventListener('input', () => {
            input.value = slider.value;
            on_change(Number(slider.value));
        });
    }

    field_slider(
        name: string,
        object: object,
        key: string,
        min?: number,
        max?: number,
        step?: number,
    ) {
        return this.slider(
            name,
            dot_read(object, key),
            value => dot_assign(object, key, value),
            min,
            max,
            step,
        );
    }
}
