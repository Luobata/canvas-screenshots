import Content from './content';
import { Position } from 'LIB/interface';
import { config, inBox } from '../config';

interface mosaic {
    lines: Array<Position>;
    width: number; // 单个马赛克大小
    num: number; // 一次操作生成马赛克数量(一个方向上)
}

export default class extends Content {
    property: mosaic;
    transctx: CanvasRenderingContext2D;
    constructor(
        ctx: CanvasRenderingContext2D,
        transctx: CanvasRenderingContext2D,
        pos: Position,
    ) {
        super(ctx);
        this.transctx = transctx;
        this.event();
        this.property = {
            lines: [pos],
            width: 3,
            num: 3,
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

    inBoxBorder(x: number, y: number) {
        return false;
    }

    draw() {
        const boxData = this.transctx.getImageData(
            config.boxRect.startX,
            config.boxRect.startY,
            config.boxRect.endX - config.boxRect.startX,
            config.boxRect.endY - config.boxRect.startY,
        );
        const data = boxData.data;
        const original = this.transctx.getImageData(
            config.boxRect.startX,
            config.boxRect.startY,
            config.boxRect.endX - config.boxRect.startX,
            config.boxRect.endY - config.boxRect.startY,
        ).data;
        for (let i of this.property.lines) {
            // 遍历所有点
            for (
                let x = i.x - this.property.width * this.property.num;
                x <= i.x + this.property.width * this.property.num;
                x = x + this.property.width
            ) {
                for (
                    let y = i.y - this.property.width * this.property.num;
                    y <= i.y + this.property.width * this.property.num;
                    y = y + this.property.width
                ) {
                    // 遍历以 (i.x, i.y)为中心的width*num个像素点
                    let r = 0;
                    let g = 0;
                    let b = 0;
                    const total = Math.pow(this.property.width + 1, 2);
                    for (let j = 0; j <= this.property.width; j++) {
                        for (let k = 0; k <= this.property.width; k++) {
                            const pX = x + j - config.boxRect.startX;
                            const pY = y + k - config.boxRect.startY;
                            const unitIndex =
                                pY *
                                    (config.boxRect.endX -
                                        config.boxRect.startX) +
                                pX;
                            r += original[unitIndex * 4 + 0];
                            g += original[unitIndex * 4 + 1];
                            b += original[unitIndex * 4 + 2];
                        }
                    }

                    r = r / total;
                    g = g / total;
                    b = b / total;
                    for (let j = 0; j <= this.property.width; j++) {
                        for (let k = 0; k <= this.property.width; k++) {
                            const pX = x + j - config.boxRect.startX;
                            const pY = y + k - config.boxRect.startY;
                            const unitIndex =
                                pY *
                                    (config.boxRect.endX -
                                        config.boxRect.startX) +
                                pX;
                            data[unitIndex * 4 + 0] = r;
                            data[unitIndex * 4 + 1] = g;
                            data[unitIndex * 4 + 2] = b;
                        }
                    }
                }
            }
        }

        this.ctx.putImageData(
            boxData,
            config.boxRect.startX,
            config.boxRect.startY,
        );
    }
}
