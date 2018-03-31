import { EventEmitter } from 'events';
import Box from './image';

export default class {
    box: Box;
    mouseEvent: string; // 处理后续move事件逻辑

    constructor(box: Box) {
        this.box = box;
        this.mouseEvent = 'crosshair'; // 鼠标点击状态 代表后续事件
    }

    mouseDown(e: MouseEvent, cursorStyle = 'crosshair') {
        this.mouseEvent = cursorStyle;
    }

    mouseMove(e: MouseEvent) {
        // move
        switch (this.mouseEvent) {
            case 'crosshair':
                break;
            case 'all-scroll':
                this.box.setSize({
                    x: this.box.property.position.x + e.movementX,
                    y: this.box.property.position.y + e.movementY,
                });
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
