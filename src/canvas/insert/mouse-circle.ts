import Circle from './circle';

export default class {
    box: Circle;
    mouseEvent: string;

    constructor(circle: Circle) {
        this.box = circle;
    }

    mouseDown(e: MouseEvent, cursorStyle = 'crosshair') {
        this.mouseEvent = cursorStyle;
    }
    mouseMove(e: MouseEvent) {
        console.log(this.mouseEvent);
        let startX;
        let startY;
        let endX;
        let endY;
        // move
        switch (this.mouseEvent) {
            case 'crosshair':
                break;
            case 'all-scroll':
                this.box.setPosition(
                    {
                        startX: this.box.circle.rect.startX + e.movementX,
                        startY: this.box.circle.rect.startY + e.movementY,
                        endX: this.box.circle.rect.endX + e.movementX,
                        endY: this.box.circle.rect.endY + e.movementY,
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
