import Content from 'INSERT/content';
import { Position } from 'LIB/interface';
interface Ipen {
    lines: Position[];
    color: string;
    lineWidth: number;
}
/**
 * default class
 */
export default class SPen extends Content {
    property: Ipen;
    private mouse;
    constructor(ctx: CanvasRenderingContext2D, color: string);
    inBoxBorder(x: number, y: number): boolean;
    getCursor(e: MouseEvent): string;
    hasBox(): boolean;
    event(): void;
    addPosition(pos: Position, isDraw?: boolean): void;
    move(x: number, y: number): void;
    draw(): void;
}
export {};
