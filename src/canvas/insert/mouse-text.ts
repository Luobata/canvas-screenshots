import Text from './textarea';

let timer = new Date().getTime();
const tick = 300; // 点击间隔 小于该值认为属于连续点击

export default class {
    box: Text;
    mouseEvent: string;
    clickTime: number;

    constructor(text: Text) {
        this.box = text;
        this.clickTime = 0;
    }

    mouseDown(currsorStyle = 'crosshair') {
        const now = new Date().getTime();
        if (this.clickTime === 0) {
            this.clickTime++;
        } else if (this.clickTime === 1) {
            if (now - timer <= tick) {
                // 双击事件
                this.box.focus();
                this.clickTime = 0;
                this.mouseEvent = 'crosshair';
                timer = now;
                return;
            }
        }
        timer = now;
        this.mouseEvent = currsorStyle;
    }

    mouseMove(e: MouseEvent) {
        switch (this.mouseEvent) {
            case 'all-scroll':
                this.box.move(e.movementX, e.movementY);
                this.box.getMaxCols();
                break;
            default:
                break;
        }
    }

    mouseUp() {
        this.mouseEvent = 'crosshair';
    }
}
