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
        const startX = this.box.property.position.x;
        const startY = this.box.property.position.y;
        const endX = this.box.property.position.x + this.box.property.width;
        const endY = this.box.property.position.y + this.box.property.height;
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
                this.box.setSize(
                    {
                        x: e.clientX,
                        y: e.clientY,
                    },
                    {
                        width:
                            this.box.property.position.x +
                            this.box.property.width -
                            e.clientX,
                        height:
                            this.box.property.position.y +
                            this.box.property.height -
                            e.clientY,
                    },
                );
                break;
            case 'w-resize':
                this.box.setSize(
                    {
                        x: e.clientX,
                        y: this.box.property.position.y,
                    },
                    {
                        width:
                            this.box.property.position.x +
                            this.box.property.width -
                            e.clientX,
                    },
                );
                break;
            case 'sw-resize':
                this.box.setSize(
                    {
                        x: e.clientX,
                        y: this.box.property.position.y,
                    },
                    {
                        width: endX - e.clientX,
                        height: e.clientY - startY,
                    },
                );
                break;
            case 's-resize':
                this.box.setSize(
                    {
                        x: this.box.property.position.x,
                        y: this.box.property.position.y,
                    },
                    {
                        height: e.clientY - this.box.property.position.y,
                    },
                );
                break;
            case 'se-resize':
                this.box.setSize(
                    {
                        x: startX,
                        y: startY,
                    },
                    {
                        width: e.clientX - startX,
                        height: e.clientY - startY,
                    },
                );
                break;
            case 'e-resize':
                this.box.setSize(
                    {
                        x: startX,
                        y: startY,
                    },
                    {
                        width: e.clientX - startX,
                    },
                );
                break;
            case 'ne-resize':
                this.box.setSize(
                    {
                        x: startX,
                        y: e.clientY,
                    },
                    {
                        width: e.clientX - startX,
                        height: endY - e.clientY,
                    },
                );
                // 触发resize
                break;
            case 'n-resize':
                this.box.setSize(
                    {
                        x: startX,
                        y: e.clientY,
                    },
                    {
                        height: endY - e.clientY,
                    },
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
