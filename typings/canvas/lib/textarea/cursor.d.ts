/**
 * @description cursor
 */
import { Position } from 'LIB/interface';
/**
 * default class Cursor
 */
export default class Cursor {
    position: Position;
    color: String;
    flashTime: number;
    timer: null | number;
    constructor(pos: Position, color: string);
    start(): void;
    end(): void;
    setPositin(pos: Position): void;
    draw(): void;
}
