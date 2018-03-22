import Cursor from './cursor';
import { Position } from 'LIB/interface';

interface Text {
    position: Position;
    width: number;
    height: number;
    padding: number;
    fontSize: string;
    fontFamily: string;
    color: string;
    background: string;
    borderColor: string;
    borderWidth: string;
    disable: boolean;
    focus: boolean;
    text?: string | number;
}

export default class TextArea {
    ctx: CanvasRenderingContext2D;
    property: Text;
    Cursor: Cursor;
    textarea: HTMLElement;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        // this.Cursor = new Cursor();
    }

    draw() {
        this.ctx.save();
        this.ctx.strokeStyle = this.property.borderColor;
        this.ctx.strokeRect(
            this.property.position.x,
            this.property.position.y,
            this.property.width,
            this.property.height,
        );

        this.ctx.restore();
    }
}
