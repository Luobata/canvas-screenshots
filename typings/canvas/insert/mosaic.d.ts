import Content from 'INSERT/content';
import { Position } from 'LIB/interface';
interface Imosaic {
    lines: Position[];
    width: number;
    num: number;
}
/**
 * default class
 */
export default class SMosaic extends Content {
    property: Imosaic;
    private transctx;
    constructor(ctx: CanvasRenderingContext2D, transctx: CanvasRenderingContext2D, pos: Position);
    addPosition(pos: Position, isDraw?: boolean): void;
    event(): void;
    inBoxBorder(x: number, y: number): boolean;
    draw(): void;
}
export {};
