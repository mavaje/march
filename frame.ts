import {struct, u32} from "./byte-packing/byte-types";
import {Packer} from "./byte-packing/packer";

export class Frame {

    private packer = new Packer(struct('Frame', {
        tick: u32,
        time: u32,
        delta: u32,
        solid_count: u32,
    }));

    static struct = new Frame().packer.type;

    constructor(
        public solid_count: number = 0,
        public tick: number = 0,
        public time: number = 0,
        public delta: number = 0,
    ) {}

    increment(time: number) {
        this.tick++;
        this.delta = time - this.time;
        this.time = time;
    }

    buffer() {
        this.packer.set(this);

        return this.packer.buffer;
    }
}
