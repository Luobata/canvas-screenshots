/**
 * @description mouse text
 */
import Text from 'INSERT/textarea';

let timer: number = new Date().getTime();
const tick: number = 300; // 点击间隔 小于该值认为属于连续点击

/**
 * default class
 */
export default class Mouse {
    public box: Text;

    private mouseEvent: string;
    private clickTime: number;

    constructor(text: Text) {
        this.box = text;
        this.clickTime = 0;
    }

    public mouseDown(currsorStyle: string = 'crosshair'): void {
        const now: number = new Date().getTime();
        if (this.clickTime === 0) {
            this.clickTime = this.clickTime + 1;
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

    public mouseMove(e: MouseEvent): void {
        switch (this.mouseEvent) {
            case 'all-scroll':
                this.box.move(e.movementX, e.movementY);
                this.box.getMaxCols();
                break;
            default:
        }
    }

    public mouseUp(): void {
        this.mouseEvent = 'crosshair';
    }
}
