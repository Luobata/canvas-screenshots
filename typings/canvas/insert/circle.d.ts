import Content from 'INSERT/content';
import { DragCircle, Rect } from 'LIB/interface';
interface Icircle {
    rect?: Rect;
    circles?: DragCircle[];
    color: string;
    borderColor: string;
    auxLineColor: string;
    borderWidth: number;
    circleWidth: number;
}
/**
 * default class
 */
export default class SCircle extends Content {
    property: Icircle;
    private mouse;
    constructor(ctx: CanvasRenderingContext2D, color: string);
    setColor(color: string): void;
    inBoxBorder(positionX: number, positionY: number): boolean;
    event(): void;
    draw(): void;
}
export {};
