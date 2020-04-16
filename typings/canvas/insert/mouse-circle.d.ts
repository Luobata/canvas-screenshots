/**
 * @default mouse circle
 */
import Circle from 'INSERT/circle';
/**
 * default class
 */
export default class {
    box: Circle;
    private mouseEvent;
    constructor(circle: Circle);
    mouseDown(e: MouseEvent, cursorStyle?: string): void;
    mouseMove(e: MouseEvent): void;
    mouseUp(e: MouseEvent): void;
}
