import { dragCircle, Rect } from 'LIB/interface';
import { config, inBox } from '../config';
import { getCircleMap } from 'LIB/help';
import { EventEmitter } from 'events';

interface property {
    rect?: Rect;
    circles?: Array<dragCircle>;
    isStroke: boolean; // 是否是是空心的
    color: string;
    lineWidth: number;
    borderRadious: number;
    circleWidth: number;
}

export default class {
    id: number;
    ctx: CanvasRenderingContext2D;
    // mouse: Mouse;
    isFocus: boolean; // 是否聚焦 聚焦才会展示可拖动点
    mouseDown: EventListener;
    mouseMove: EventListener;
    mouseUp: EventListener;

    property: property;
    saveArray: Array<property>;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.id = config.uid++;

        this.isFocus = true;
        this.saveArray = [];
    }

    save() {
        this.saveArray.push(JSON.parse(JSON.stringify(this.property)));
    }

    back() {
        if (this.saveArray.length) {
            this.saveArray.pop();
            this.property = this.saveArray[this.saveArray.length - 1];
        }
        if (!this.property) {
            this.destroyed();
        }
    }

    destroyed() {
        config.emitter.off('mousedown', this.mouseDown);
        config.emitter.off('mousemove', this.mouseMove);
        config.emitter.off('mouseup', this.mouseUp);
        config.emitter.emit('removeItem', this);
    }

    setColor(color: string) {
        this.property.color = color;
        this.save();
        config.emitter.emit('draw-all');
    }

    getCursor(e: MouseEvent, type?: string) {}

    event() {}

    initBox() {}

    hasBox() {}

    inBoxBorder(positionX: number, positionY: number) {}

    inBox(positionX: number, positionY: number, circlePath = 0) {}

    draw() {}
}
