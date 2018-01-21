import Circle from './circle';

export default class {
    circle: Circle;
    mouseEvent: string;

    constructor(circle: Circle) {
        this.circle = circle;
    }

    mouseDown(e: MouseEvent, cursorStyle = 'crosshair') {
        this.mouseEvent = cursorStyle;
    }
    mouseMove(e: MouseEvent) {
        let startX;
        let startY;
        let endX;
        let endY;
        // move
        switch (this.mouseEvent) {
            case 'crosshair':
                break;
            case 'all-scroll':
                this.circle.setPosition(
                    {
                        centerX: this.circle.circle.centerX + e.movementX,
                        centerY: this.circle.circle.centerY + e.movementY,
                    },
                    true,
                );
                break;
            case 'nw-resize':
                startX = e.clientX;
                startY = e.clientY;
                endX = this.circle.circle.centerX + this.circle.circle.radiusX;
                endY = this.circle.circle.centerY + this.circle.circle.radiusY;
                this.circle.setPosition(
                    {
                        centerX: (startX + endX) / 2,
                        centerY: (startY + endY) / 2,
                        radiusX: Math.abs((startX - endX) / 2),
                        radiusY: Math.abs((startY - endY) / 2),
                    },
                    true,
                );
                break;
            case 'w-resize':
                startX = e.clientX;
                endX = this.circle.circle.centerX + this.circle.circle.radiusX;
                this.circle.setPosition(
                    {
                        centerX: (startX + endX) / 2,
                        radiusX: Math.abs((startX - endX) / 2),
                    },
                    true,
                );
                break;
            case 'sw-resize':
                startX = e.clientX;
                startY =
                    this.circle.circle.centerY - this.circle.circle.radiusY;
                endX = this.circle.circle.centerX + this.circle.circle.radiusY;
                endY = e.clientY;
                this.circle.setPosition(
                    {
                        centerX: (startX + endX) / 2,
                        centerY: (startY + endY) / 2,
                        radiusX: Math.abs((startX - endX) / 2),
                        radiusY: Math.abs((startY - endY) / 2),
                    },
                    true,
                );
                break;
            case 's-resize':
                startY = e.clientY;
                endY = this.circle.circle.centerY - this.circle.circle.radiusY;
                this.circle.setPosition(
                    {
                        centerY: (startY + endY) / 2,
                        radiusY: Math.abs((startY - endY) / 2),
                    },
                    true,
                );
                break;
            case 'se-resize':
                startX =
                    this.circle.circle.centerX + this.circle.circle.radiusX;
                startY =
                    this.circle.circle.centerY + this.circle.circle.radiusY;
                endX = e.clientX;
                endY = e.clientY;
                this.circle.setPosition(
                    {
                        centerX: (startX + endX) / 2,
                        centerY: (startY + endY) / 2,
                        radiusX: Math.abs((startX - endX) / 2),
                        radiusY: Math.abs((startY - endY) / 2),
                    },
                    true,
                );
                break;
            case 'e-resize':
                startX =
                    this.circle.circle.centerX - this.circle.circle.radiusX;
                endX = e.clientX;
                this.circle.setPosition(
                    {
                        centerX: (startX + endX) / 2,
                        radiusX: Math.abs((startX - endX) / 2),
                    },
                    true,
                );
                // 触发resize
                break;
            case 'ne-resize':
                startX =
                    this.circle.circle.centerX + this.circle.circle.radiusX;
                startY = e.clientY;
                endX = e.clientX;
                endY = this.circle.circle.centerY + this.circle.circle.radiusY;
                this.circle.setPosition(
                    {
                        centerX: (startX + endX) / 2,
                        centerY: (startY + endY) / 2,
                        radiusX: Math.abs((startX - endX) / 2),
                        radiusY: Math.abs((startY - endY) / 2),
                    },
                    true,
                );
                // 触发resize
                break;
            case 'n-resize':
                startY = e.clientY;
                endY = this.circle.circle.centerY + this.circle.circle.radiusY;
                this.circle.setPosition(
                    {
                        centerY: (startY + endY) / 2,
                        radiusY: Math.abs((startY - endY) / 2),
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
