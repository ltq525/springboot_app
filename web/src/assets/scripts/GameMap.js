// export 有 default 不用括号
import { GameObject } from "./GameObject";
import { Wall } from "./Wall"

export class GameMap extends GameObject {
    constructor(ctx, parent) {
        super();
        this.ctx = ctx;
        this.parent = parent;
        this.L = 0; // 13个单位格子的长度

        this.rows = 13;
        this.cols = 13;

        this.inner_wall_count = 20;
        this.walls = [];
    }

    check_connectivity(g, sx, sy, tx, ty) {
        if (sx == tx && tx == tx) return true;
        g[sx][sy] = true;

        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for (let i = 0; i < 4; i++) {
            let x = sx + dx[i], y = sy + dy[i];
            if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty)) return true;
        }

        return false;
    }

    create_walls() {
        const g = [];
        for (let r = 0; r < this.rows; r++) {
            g[r] = [];
            for (let c = 0; c < this.cols; c++) {
                g[r][c] = false;
            }
        }

        for (let r = 0; r < this.rows; r++) {
            g[r][0] = g[r][this.rows - 1] = true;
        }

        for (let c = 0; c < this.cols; c++) {
            g[0][c] = g[this.cols - 1][c] = true;
        }

        for (let i = 0; i < this.inner_wall_count / 2; i++) {
            for (let j = 0; j < 1000; j++) {
                // 随机 1 ~ this.rows - 1
                let r = parseInt(Math.random() * (this.rows - 1)) + 1;
                let c = parseInt(Math.random() * (this.cols - 1)) + 1;
                if (g[r][c] || g[c][r]) continue;
                g[r][c] = g[c][r] = true;
                break;
            }
        }

        const copy_g = JSON.parse(JSON.stringify(g));
        if (!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)) return false;

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }
        return true;
    }

    start() { // 创建对象
        for (let i = 0; i < 1000; i++) {
            if (this.create_walls())
                break;
        }
    }


    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows))
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    update() {  // 每一帧更新一次
        this.update_size();
        this.render();
    }

    on_destroy() { // 删除之前执行一次

    }

    render() {
        const color_even = "#AAD751", color_odd = "#A2D149";
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if ((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                // x, y, width, height
                this.ctx.fillRect(r * this.L, c * this.L, this.L, this.L);
            }
        }

    }
}