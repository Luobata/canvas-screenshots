/**
 * @description mouse text
 */
import Text from 'INSERT/textarea';
/**
 * default class
 */
export default class Mouse {
    box: Text;
    private mouseEvent;
    private clickTime;
    constructor(text: Text);
    mouseDown(currsorStyle?: string): void;
    mouseMove(e: MouseEvent): void;
    mouseUp(): void;
}
