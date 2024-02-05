// export 有 default 不用括号
import { GameObject } from "./GameObject";

export class Wall extends GameObject {
    constructor(r, c, gamemap) {
        super();

        this.r = r;
        this.c = c;
        this.gamemap = gamemap;
        this.color = '#B37226';
    }

    start() { // 创建对象

    }

    update_size() {

    }

    update() {  // 每一帧更新一次

        this.render();
    }

    on_destroy() { // 删除之前执行一次

    }

    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.c * L, this.r * L, L, L);

    }
}