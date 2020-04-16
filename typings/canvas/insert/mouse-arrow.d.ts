/**
 * @description mouse
 */
import Arrow from 'INSERT/arrow';
export default class {
    box: Arrow;
    mouseEvent: string;
    constructor(arrow: Arrow);
    mouseDown(e: MouseEvent, cursorStyle?: string): void;
    mouseMove(e: MouseEvent): void;
    mouseUp(e: MouseEvent): void;
}
