export class Solid {
    packer;
    static name;
    index;
    name() {
        return this.constructor.name.toLowerCase();
    }
    struct() {
        return this.packer.type;
    }
    buffer() {
        this.packer.set_struct(this);
        return this.packer.buffer;
    }
    hit_code() {
        const name = this.name();
        return `hit_${name}(origin, ${name}_list[${this.index}])`;
    }
}
