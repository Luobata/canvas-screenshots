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
    constructor(ctx: CanvasRenderingContext2D, pos: Position) {
        super(ctx);
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

    draw() {
        const data = this.ctx.getImageData(
            config.boxRect.startX,
            config.boxRect.startY,
            config.boxRect.endX - config.boxRect.startX,
            config.boxRect.endY - config.boxRect.startY,
        ).data;
        console.log(data);
        // https://www.jianshu.com/p/3d2a8bd83191
        for (let i of this.property.lines) {
            for (
                let x = i.x - this.property.width * this.property.num;
                x < i.x + this.property.width + this.property.num;
                x = x + this.property.width
            ) {
                for (
                    let y = i.y - this.property.width * this.property.num;
                    y < i.y + this.property.width + this.property.num;
                    y = y + this.property.width
                ) {
                    // 遍历以 (i.x, i.y)为中心的width*num个像素点
                }
            }
            for (let j = -this.property.width; j <= this.property.width; j++) {
                for (
                    let k = -this.property.width;
                    k <= this.property.width;
                    k++
                ) {
                    // data[k, j]
                }
            }
        }
    }
}
