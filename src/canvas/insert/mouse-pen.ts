import Pen from './pen';
export default class {
    box: Pen;
    mouseEvent: string;

    constructor(pen: Pen) {
        this.box = pen;
    }

    mouseDown(cursorStyle = 'crosshair') {
        this.mouseEvent = cursorStyle;
    }

    mouseMove(e: MouseEvent) {
        switch (this.mouseEvent) {
            case 'all-scroll':
                this.box.move(e.movementX, e.movementY);
                break;
            default:
                break;
        }
    }
    mouseUp() {
        this.mouseEvent = 'crosshair';
    }
}
