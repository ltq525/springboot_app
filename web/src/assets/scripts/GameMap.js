// export 有 default 不用括号
import { GameObject } from "./GameObject";
import { Snake } from "./Snake";
import { Wall } from "./Wall"

export class GameMap extends GameObject {
    constructor(ctx, parent, store) {
        super();
        this.ctx = ctx;
        this.parent = parent;

        this.store = store;
        this.L = 0;

        this.rows = 13;
        this.cols = 14;

        this.inner_walls_count = 20;
        this.walls = [];

        this.snakes = [
            new Snake({ id: 0, color: '#4876EC', r: this.rows - 2, c: 1 }, this),
            new Snake({ id: 1, color: 'pink', r: 1, c: this.cols - 2 }, this),
        ]

    }

    create_walls() {
        const g = this.store.state.pk.game_map;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }
    }

    add_listening_events() {
        this.ctx.canvas.focus();
        this.ctx.canvas.addEventListener("keydown", (e) => {
            let d = -1;
            if (e.key === 'w') d = 0;
            else if (e.key === 'd') d = 1;
            else if (e.key === 's') d = 2;
            else if (e.key === 'a') d = 3;
            else if (e.key === 'ArrowUp') d = 0;
            else if (e.key === 'ArrowRight') d = 1;
            else if (e.key === 'ArrowDown') d = 2;
            else if (e.key === 'ArrowLeft') d = 3;

            if (d >= 0) {
                this.store.state.pk.socket.send(JSON.stringify({
                    event: "move",
                    direction: d,
                }));
            }
        });
    }

    start() { // 创建对象
        this.create_walls();

        this.add_listening_events();
    }

    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows))
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    check_ready() {
        for (const sanke of this.snakes) {
            if (sanke.status !== "idle") return false;
            if (sanke.direction === -1) return false;
        }
        return true;
    }

    check_valid(cell) {  // 检测目标位置是否合法：没有撞到两条蛇的身体和障碍物
        for (const wall of this.walls) {
            if (wall.r === cell.r && wall.c === cell.c)
                return false;
        }

        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) {  // 当蛇尾会前进的时候，蛇尾不要判断
                k--;
            }
            for (let i = 0; i < k; i++) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c)
                    return false;
            }
        }

        return true;
    }


    next_step() {
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }

    update() {  // 每一帧更新一次
        this.update_size();
        if (this.check_ready()) {
            this.next_step();
        }
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