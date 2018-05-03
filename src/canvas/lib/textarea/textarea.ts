/**
 * @description textare
 */

import { Position } from 'LIB/interface';
import Cursor from 'LIB/textarea/cursor';

interface IText {
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

/**
 * default class TextArea
 */
export default class TextArea {
    public property: IText;
    public cursor: Cursor;
    public textarea: HTMLElement;

    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        // this.Cursor = new Cursor();
    }

    public draw(): void {
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
