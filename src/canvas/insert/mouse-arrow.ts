/**
 * @description mouse
 */
import Arrow from 'INSERT/arrow';

export default class {
    public box: Arrow;
    public mouseEvent: string;

    constructor(arrow: Arrow) {
        this.box = arrow;
    }

    public mouseDown(e: MouseEvent, cursorStyle: string = 'crosshair'): void {
        this.mouseEvent = cursorStyle;
    }
    public mouseMove(e: MouseEvent): void {
        // move
        switch (this.mouseEvent) {
            case 'crosshair':
                break;
            case 'all-scroll':
                this.box.setPosition(
                    {
                        startX: this.box.property.rect.startX + e.movementX,
                        startY: this.box.property.rect.startY + e.movementY,
                        endX: this.box.property.rect.endX + e.movementX,
                        endY: this.box.property.rect.endY + e.movementY,
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
            case 'se-resize':
                this.box.setPosition(
                    {
                        endX: e.clientX,
                        endY: e.clientY,
                    },
                    true,
                );
                break;
            default:
        }
    }

    public mouseUp(e: MouseEvent): void {
        this.mouseEvent = 'crosshair';
    }
}
