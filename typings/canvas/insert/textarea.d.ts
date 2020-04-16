import Content from 'INSERT/content';
import { Position } from 'LIB/interface';
interface Iproperty {
    position: Position;
    text: string;
    txts: string[];
    width?: number;
    height?: number;
    cols: number;
    rows: number;
    maxCols?: number;
    maxRows?: number;
    color: string;
    borderColor: string;
    borderWidth: number;
    fontSize: string;
    fontFamily: string;
    isEditor?: boolean;
}
/**
 * default class
 */
export default class SText extends Content {
    property: Iproperty;
    private input;
    private inputListener;
    private inputBlurListener;
    private mouse;
    constructor(ctx: CanvasRenderingContext2D, pos: Position, color: string);
    setColor(color: string): void;
    getCursor(e: MouseEvent): string;
    move(x: number, y: number): void;
    focus(): void;
    inBoxBorder(x: number, y: number): boolean;
    getMaxCols(): void;
    hasBox(): boolean;
    event(): void;
    draw(): void;
    keyCodeListener(): void;
    destroyed(): void;
    private getSize;
    private getTextInput;
    private initTextArea;
    private drawText;
}
export {};
