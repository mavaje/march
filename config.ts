import {struct, u32} from "./byte-packing/byte-types";
import {Packer} from "./byte-packing/packer";
import {Sun} from "./light/sun";
import {Camera} from "./camera/camera";

export class Config {

    private packer = new Packer(struct('Config', {
        camera: Camera.struct,
        sun: Sun.struct,
        settings: u32,
    }));

    static struct = new Config().packer.type;

    public camera: Camera;
    public sun: Sun;
    public shadows: boolean = false;

    buffer() {
        this.packer.set(this);
        this.packer.set(
            'settings',
            this.shadows ? 1 : 0,
        );

        return this.packer.buffer;
    }
}
