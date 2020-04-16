/**
 * @default mouse pen
 */
import Pen from 'INSERT/pen';
/**
 * default class
 */
export default class Mouse {
    box: Pen;
    private mouseEvent;
    constructor(pen: Pen);
    mouseDown(cursorStyle?: string): void;
    mouseMove(e: MouseEvent): void;
    mouseUp(): void;
}
