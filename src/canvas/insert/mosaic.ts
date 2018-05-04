/**
 * @description mosaic
 */
import { config, inBox } from 'Canvas/config';
import Content from 'INSERT/content';
import { Position } from 'LIB/interface';

interface Imosaic {
    lines: Position[];
    width: number; // 单个马赛克大小
    num: number; // 一次操作生成马赛克数量(一个方向上)
}

/**
 * default class
 */
export default class SMosaic extends Content {
    public property: Imosaic;
    private transctx: CanvasRenderingContext2D;

    constructor(
        ctx: CanvasRenderingContext2D,
        transctx: CanvasRenderingContext2D,
        pos: Position,
    ) {
        super(ctx);
        // 马赛克没有focus状态
        this.isFocus = false;
        this.transctx = transctx;
        this.event();
        this.property = {
            lines: [pos],
            width: config.rate * 3,
            num: 3,
        };
    }

    public addPosition(pos: Position, isDraw: boolean = false): void {
        this.property.lines.push(pos);

        if (isDraw) {
            config.emitter.emit('draw-all');
        }
    }

    public event(): void {
        this.mouseDown = (e: MouseEvent): void => {
            if (inBox(e)) {
                // TODO
            }
        };
        this.mouseMove = (e: MouseEvent): void => {
            // TODO
        };
        this.mouseUp = (e: MouseEvent): void => {
            // TODO
        };

        config.emitter.on('mousedown', this.mouseDown);
        config.emitter.on('mousemove', this.mouseMove);
        config.emitter.on('mouseup', this.mouseUp);
    }

    public inBoxBorder(x: number, y: number): boolean {
        return false;
    }

    public draw(): void {
        const boxData: ImageData = this.transctx.getImageData(
            config.rate * config.boxRect.startX,
            config.rate * config.boxRect.startY,
            config.rate * (config.boxRect.endX - config.boxRect.startX),
            config.rate * (config.boxRect.endY - config.boxRect.startY),
        );
        const data: Uint8ClampedArray = boxData.data;
        const original: Uint8ClampedArray = this.transctx.getImageData(
            config.rate * config.boxRect.startX,
            config.rate * config.boxRect.startY,
            config.rate * (config.boxRect.endX - config.boxRect.startX),
            config.rate * (config.boxRect.endY - config.boxRect.startY),
        ).data;
        for (const i of this.property.lines) {
            // 遍历所有点
            for (
                let x: number =
                    i.x * config.rate - this.property.width * this.property.num;
                x <=
                i.x * config.rate + this.property.width * this.property.num;
                x = x + this.property.width
            ) {
                for (
                    let y: number =
                        i.y * config.rate -
                        this.property.width * this.property.num;
                    y <=
                    i.y * config.rate + this.property.width * this.property.num;
                    y = y + this.property.width
                ) {
                    // 遍历以 (i.x, i.y)为中心的width*num个像素点
                    let r: number = 0;
                    let g: number = 0;
                    let b: number = 0;
                    const total: number = Math.pow(this.property.width + 1, 2);
                    for (
                        let j: number = 0;
                        j <= this.property.width;
                        j = j + 1
                    ) {
                        for (
                            let k: number = 0;
                            k <= this.property.width;
                            k = k + 1
                        ) {
                            const pX: number =
                                x + j - config.boxRect.startX * config.rate;
                            const pY: number =
                                y + k - config.boxRect.startY * config.rate;
                            const unitIndex: number =
                                pY *
                                    (config.boxRect.endX -
                                        config.boxRect.startX) *
                                    config.rate +
                                pX;
                            r += original[unitIndex * 4 + 0];
                            g += original[unitIndex * 4 + 1];
                            b += original[unitIndex * 4 + 2];
                        }
                    }

                    r = r / total;
                    g = g / total;
                    b = b / total;
                    for (
                        let j: number = 0;
                        j <= this.property.width;
                        j = j + 1
                    ) {
                        for (
                            let k: number = 0;
                            k <= this.property.width;
                            k = k + 1
                        ) {
                            const pX: number =
                                x + j - config.boxRect.startX * config.rate;
                            const pY: number =
                                y + k - config.boxRect.startY * config.rate;
                            const unitIndex: number =
                                pY *
                                    (config.boxRect.endX -
                                        config.boxRect.startX) *
                                    config.rate +
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
            config.rate * config.boxRect.startX,
            config.rate * config.boxRect.startY,
        );
    }
}
