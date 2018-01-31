import { Position } from 'LIB/interface';
import { config } from '../config';

export default class {
    ctx: CanvasRenderingContext2D;
    text: string;
    color: string;
    fontSize: string;
    fontFamily: string;
    id: number;
    isFocus: boolean;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.color = (<any>window).color || 'red';
        this.id = config.uid++;
        this.isFocus = true;
        this.event();
    }

    event() {}
}
