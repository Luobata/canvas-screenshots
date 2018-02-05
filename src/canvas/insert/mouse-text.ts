import Text from './text';

export default class {
    box: Text;
    mouseEvent: string;

    constructor(text: Text) {
        this.box = text;
    }

    mouseDown(currsorStyle = 'crosshair') {
        this.mouseEvent = currsorStyle;
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
