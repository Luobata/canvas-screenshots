import Arrow from './arrow';

export default class {
    box: Arrow;
    mouseEvent: string;

    constructor(arrow: Arrow) {
        this.box = arrow;
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
                        startX: this.box.rect.startX + e.movementX,
                        startY: this.box.rect.startY + e.movementY,
                        endX: this.box.rect.endX + e.movementX,
                        endY: this.box.rect.endY + e.movementY,
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
