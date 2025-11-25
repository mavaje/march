import {Marcher} from "./marcher";

const marcher = new Marcher(512, 512);

document.body.append(marcher.canvas);
document.body.append(marcher.controls.element);

marcher.initialise().then(() => {
    marcher.render_cycle();
});
