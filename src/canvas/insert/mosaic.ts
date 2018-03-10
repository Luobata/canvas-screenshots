import Content from './content';
import { Position } from 'LIB/interface';
import { config, inBox } from '../config';

interface mosaic {
    lines: Array<Position>;
    circleWidth: number;
}

export default class extends Content {
    property: mosaic;
    constructor(ctx: CanvasRenderingContext2D, pos: Position) {
        super(ctx);
        this.event();
        this.property = {
            lines: [pos],
            circleWidth: 3,
        };
    }

    addPosition(pos: Position, isDraw = false) {
        this.property.lines.push(pos);

        if (isDraw) {
            config.emitter.emit('draw-all');
        }
    }

    event() {
        this.mouseDown = (e: MouseEvent) => {
            if (inBox(e)) {
            }
        };
        this.mouseMove = (e: MouseEvent) => {};
        this.mouseUp = (e: MouseEvent) => {};

        config.emitter.on('mousedown', this.mouseDown);
        config.emitter.on('mousemove', this.mouseMove);
        config.emitter.on('mouseup', this.mouseUp);
    }

    draw() {
        const data = this.ctx.getImageData(
            config.boxRect.startX,
            config.boxRect.startY,
            config.boxRect.endX - config.boxRect.startX,
            config.boxRect.endY - config.boxRect.startY,
        ).data;
        for (let i of this.property.lines) {
            for (
                let j = i.y - this.property.circleWidth;
                j <= i.y + this.property.circleWidth;
                j++
            ) {
                for (
                    let k = i.x - this.property.circleWidth;
                    k <= i.x + this.property.circleWidth;
                    k++
                ) {
                    // data[k, j]
                }
            }
        }
    }
}
