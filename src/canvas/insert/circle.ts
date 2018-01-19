import { dragCircle, Circle } from 'LIB/interface';
import { config } from '../config';
import { getCircleMapWithCircle } from 'LIB/help';

const circlePath = 10; // 手势范围 认为这个范围内就是可以使用新手势

const inCircle = (
    x: number,
    y: number,
    positionX: number,
    positinY: number,
): boolean => {
    return !!(
        Math.pow(x - positionX, 2) + Math.pow(y - positinY, 2) <=
        Math.pow(circlePath, 2)
    );
};

export default class {
    id: number;
    circle: Circle;
    circles: Array<dragCircle>;
    ctx: CanvasRenderingContext2D;
    isFocus: boolean;
    color: string;
    borderColor: string;
    borderWidth: number;
    circleWidth: number;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.isFocus = true;
        this.borderColor = 'black';
        this.color = 'black';
        this.circleWidth = 3;
        this.id = config.uid++;

        this.event();
        this.drawAll();
    }

    getCursor(e: MouseEvent, type?: string) {
        let result = 'crosshair'; // 判断鼠标位置结果 默认即crosshair
        for (let i of this.circles) {
            if (inCircle(i.x, i.y, e.clientX, e.clientY)) {
                // 在这个范围内 对应的手势图标
                //result = `${i.cssPosition}-resize`;
                if (type === 'eve') {
                    result = `${i.cssPositionEve}-resize`;
                } else {
                    result = `${i.cssPosition}-resize`;
                }
            }
        }
        if (result === 'crosshair') {
            // 如果还是十字 如果在边上 则可以拖动
            if (this.inBoxBorder(e.clientX, e.clientY)) {
                result = 'all-scroll';
            }
        }

        return result;
    }

    inBoxBorder(positionX: number, positionY: number) {
        const margin = 0.1;
        let a;
        let b;
        if (this.circle.radiusX > this.circle.radiusY) {
            a = this.circle.radiusX;
            b = this.circle.radiusY;
        } else {
            a = this.circle.radiusY;
            b = this.circle.radiusX;
        }
        const res =
            Math.pow(positionX - this.circle.centerX, 2) / Math.pow(a, 2) +
            Math.pow(positionY - this.circle.centerY, 2) / Math.pow(b, 2);

        return Math.abs(res - 1) < margin;
    }

    inCircle() {}

    event() {}

    draw() {
        const circleMap = getCircleMapWithCircle(this.circle, this.borderWidth);
        this.circles = circleMap;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.borderColor;
        this.ctx.lineWidth = this.borderWidth;
        this.ctx.stroke();
        const ellipse = (circle: Circle) => {
            const r =
                circle.radiusX > circle.radiusY
                    ? circle.radiusX
                    : circle.radiusY;
            var ratioX = circle.radiusX / r;
            var ratioY = circle.radiusY / r;
            this.ctx.scale(ratioX, ratioY);
            this.ctx.beginPath();
            this.ctx.arc(
                circle.centerX / ratioX,
                circle.centerY / ratioY,
                r,
                0,
                2 * Math.PI,
                false,
            );
            this.ctx.closePath();
            this.ctx.restore();
            this.ctx.fill();
        };

        ellipse(this.circle);
        // 画椭圆
        if (this.isFocus) {
            for (let i of circleMap) {
                this.ctx.beginPath();
                this.ctx.fillStyle = this.color;
                this.ctx.arc(i.x, i.y, this.circleWidth, 0, Math.PI * 2, true);
                this.ctx.stroke();
                this.ctx.fillStyle = 'white';
                this.ctx.fill();
            }
        }

        this.ctx.restore();
    }

    drawAll() {
        config.emitter.on('draw-all', () => {
            this.drawAll();
        });
    }
}
