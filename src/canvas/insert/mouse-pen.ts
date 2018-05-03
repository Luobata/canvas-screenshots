/**
 * @default mouse pen
 */
import Pen from 'INSERT/pen';

/**
 * default class
 */
export default class Mouse {
    public box: Pen;
    private mouseEvent: string;

    constructor(pen: Pen) {
        this.box = pen;
    }

    public mouseDown(cursorStyle: string = 'crosshair'): void {
        this.mouseEvent = cursorStyle;
    }

    public mouseMove(e: MouseEvent): void {
        switch (this.mouseEvent) {
            case 'all-scroll':
                this.box.move(e.movementX, e.movementY);
                break;
            default:
        }
    }
    public mouseUp(): void {
        this.mouseEvent = 'crosshair';
    }
}
