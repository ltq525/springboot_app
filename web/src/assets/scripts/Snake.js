import { GameObject } from "./GameObject";
import { Cell } from "./Cell";

export class Snake extends GameObject {
    constructor(info, gamemap) {
        super();

        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;

        this.cells = [new Cell(info.r, info.c)]; // 存放蛇，cells[0]表示蛇头
        this.next_cell = null; // 下一步位置

        this.speed = 5; // 每秒走五个格子
        this.direction = -1; // -1没有指令， 0、1、2、3表示上右下左
        this.status = "idle"; // idle静止、 move移动、die死亡

        // 方向数组
        this.dr = [-1, 0, 1, 0];
        this.dc = [0, 1, 0, -1];

        this.step = 0;
        this.eps = 1e-2;

        this.eye_direction = 0;
        if (this.id === 1) this.eye_direction = 2;  // 左下角的蛇初始朝上，右上角的蛇朝下

        this.eye_dx = [  // 蛇眼睛不同方向的x的偏移量
            [-1, 1],
            [1, 1],
            [1, -1],
            [-1, -1],
        ];
        this.eye_dy = [  // 蛇眼睛不同方向的y的偏移量
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1],
        ]

    }

    start() {

    }

    set_direction(d) {
        this.direction = d;
    }

    check_tail_increasing() { // 检查蛇长度是否增加
        if (this.step % 2 === 1)    return true;
        return false;
    }

    next_step() {
        if (this.direction === -1)  return false;
        const d = this.direction;
        this.eye_direction = d;
        this.next_cell = new Cell(this.cells[0].r + this.dr[d], this.cells[0].c + this.dc[d]);
        this.direction = -1;
        this.status = "move";
        this.step++;

        const k = this.cells.length;
        for (let i = k; i > 0; i --) {
            // 深层复制, 即深克隆
            this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
        }

        if (!this.gamemap.check_valid(this.next_cell)) {
            this.status = "die";
        }
    }

    update_move() {
        const dx = this.next_cell.x - this.cells[0].x;
        const dy = this.next_cell.y - this.cells[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if(distance < this.eps) {
            this.cells[0] = this.next_cell;
            this.next_cell = null;
            this.status = "idle";

            if (!this.check_tail_increasing()) { // 不变长则去掉蛇尾
                this.cells.pop();
            }
        }else {
            const move_distance = this.speed * this.timedelte / 1000;
            this.cells[0].x += move_distance * dx / distance;
            this.cells[0].y += move_distance * dy / distance;

            if (!this.check_tail_increasing()) {
                const k = this.cells.length;
                const tail = this.cells[k - 1], tail_target = this.cells[k - 2];
                const tail_dx = tail_target.x - tail.x;
                const tail_yx = tail_target.y - tail.y;
                tail.x += move_distance * tail_dx / distance;
                tail.y += move_distance * tail_yx / distance;
            }

        }
    }

    update() { // 每一帧的更新动作
        this.render();
        if (this.status === 'move') {
            this.update_move();
        }

    }

    render() {
        const L = this.gamemap.L;
        const ctx = this.gamemap.ctx;

        ctx.fillStyle = this.color;

        if (this.status === "die") {
            ctx.fillStyle = "white";
        }

        for (const cell of this.cells) {
            ctx.beginPath();
            ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, Math.PI * 2);
            ctx.fill();
        }

        for (let i = 1; i < this.cells.length; i ++ ) {
            const a = this.cells[i - 1], b = this.cells[i];
            if (Math.abs(a.x - b.x) < this.eps && Math.abs(a.y - b.y) < this.eps)
                continue;
            if (Math.abs(a.x - b.x) < this.eps) {
                ctx.fillRect((a.x - 0.4) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L);
            } else {
                ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.4) * L, Math.abs(a.x - b.x) * L, L * 0.8);
            }
        }

        ctx.fillStyle = "black";
        for (let i = 0; i < 2; i ++ ) {
            const eye_x = (this.cells[0].x + this.eye_dx[this.eye_direction][i] * 0.15) * L;
            const eye_y = (this.cells[0].y + this.eye_dy[this.eye_direction][i] * 0.15) * L;

            ctx.beginPath();
            ctx.arc(eye_x, eye_y, L * 0.05, 0, Math.PI * 2);
            ctx.fill();
        }

    }
}