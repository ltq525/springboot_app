export class Cell {
    constructor(r, c) {
        this.r = r;
        this.c = c;
        // canvas的x, y坐标与数组相反
        this.x = c + 0.5;
        this.y = r + 0.5;
    }
}