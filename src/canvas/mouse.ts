import Box from './box';
import { EventEmitter } from 'events';

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
                this.emitter.emit('shot');
                this.clickTime = 0;
            }
        }
        timer = now;

        this.mouseEvent = cursorStyle;
    }

    mouseMove(e: MouseEvent) {
        // 翻转后 替换的坐标也要相应的替换
        console.log(this.mouseEvent);
        // move
        switch (this.mouseEvent) {
            case 'crosshair':
                break;
            case 'all-scroll':
                this.box.setPosition(
                    {
                        startX: this.box.rect.startX + e.movementX,
                        startY: this.box.rect.startY + e.movementY,
                        endX: this.box.rect.endX + e.movementX,
                        endY: this.box.rect.endY + e.movementY,
                    },
                    true,
                );
                break;
            case 'nw-resize':
                this.box.setPosition(
                    {
                        startX: e.clientX,
                        startY: e.clientY,
                    },
                    true,
                );
                break;
            case 'w-resize':
                this.box.setPosition(
                    {
                        startX: e.clientX,
                    },
                    true,
                );
                break;
            case 'sw-resize':
                this.box.setPosition(
                    {
                        startX: e.clientX,
                        endY: e.clientY,
                    },
                    true,
                );
                break;
            case 's-resize':
                this.box.setPosition(
                    {
                        endY: e.clientY,
                    },
                    true,
                );
                break;
            case 'se-resize':
                this.box.setPosition(
                    {
                        endX: e.clientX,
                        endY: e.clientY,
                    },
                    true,
                );
                break;
            case 'e-resize':
                this.box.setPosition(
                    {
                        endX: e.clientX,
                    },
                    true,
                );
                // 触发resize
                break;
            case 'ne-resize':
                this.box.setPosition(
                    {
                        startY: e.clientY,
                        endX: e.clientX,
                    },
                    true,
                );
                // 触发resize
                break;
            case 'n-resize':
                this.box.setPosition(
                    {
                        startY: e.clientY,
                    },
                    true,
                );
                break;
            default:
                break;
        }
    }

    mouseUp(e: MouseEvent) {
        this.mouseEvent = 'crosshair';
    }
}
