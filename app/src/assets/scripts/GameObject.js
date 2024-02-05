const GAME_OBJECTS = [];

export class GameObject {
    constructor() {
        GAME_OBJECTS.push(this);
        this.timedelte = 0;

        this.has_called_start = false;
    }

    start() { // 创建对象

    }

    update() {  // 每一帧更新一次

    }

    on_destroy() { // 删除之前执行一次

    }

    destroy() { // 删除对象
        for (let i in GAME_OBJECTS) {
            const obj = GAME_OBJECTS[i];
            if (obj === this) {
                GAME_OBJECTS.splice(i);
                break;
            }
        }
    }
}

let last_timestamp = 0; // 上一次执行的时间
const step = (timestamp) => {

    for (let obj of GAME_OBJECTS) {
        if(!obj.has_called_start) {
            obj.has_called_start = true;
            obj.start();
        } else {
            obj.timedelte = timestamp - last_timestamp;
            obj.update();
            
        }
    }
    last_timestamp = timestamp++;
    requestAnimationFrame(step);
}

requestAnimationFrame(step)