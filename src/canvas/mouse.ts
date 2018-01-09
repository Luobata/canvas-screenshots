import Box from './box';
import { EventEmitter } from 'events';
const ee = require('event-emitter')();

let timer = new Date().getTime();
const tick = 300; // 点击间隔 小于该值认为属于连续点击

export default class {
    box: Box;
    mouseEvent: string; // 处理后续move事件逻辑
    clickTime: number; // 点击次数 只在出现box之后计算 用于判断是否生成截图
    emitter: EventEmitter;

    constructor(box: Box, emitter: EventEmitter) {
        this.box = box;
        this.emitter = emitter;
        this.mouseEvent = 'crosshair'; // 鼠标点击状态 代表后续事件
        this.clickTime = 0;
    }

    mouseDown(e: MouseEvent, cursorStyle: string) {
        const now = new Date().getTime();
        if (this.clickTime === 0) {
            this.clickTime++;
        } else if (this.clickTime === 1) {
            if (now - timer <= tick) {
                // 调用截图
                console.log('shot');
                this.clickTime = 0;
            }
        }
        timer = now;

        this.mouseEvent = cursorStyle;
        console.log(this.mouseEvent);
    }

    mouseMove(e: MouseEvent) {
        // move
        switch (this.mouseEvent) {
            case 'crosshair':
                break;
            case 'e-resize':
                this.box.setPosition({
                    endX: e.clientX,
                });
                this.emitter.emit('draw');
                // 触发resize
                break;
            default:
                break;
        }
    }
}
