import { inBox } from './help';

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
let timer = new Date().getTime();
const tick = 300; // 点击间隔 小于该值认为属于连续点击

const mousedown = function(e: MouseEvent) {
    const now = new Date().getTime();
    if (this.clickTime === 0) {
        this.clickTime++;
    } else if (this.clickTime === 1) {
        if (now - timer <= tick) {
            this.screenShots();
            this.clickTime = 0;
        }
    }
    timer = now;
};

export const cursor = function(e: MouseEvent): string {
    let result = 'crosshair'; // 判断鼠标位置结果 默认即corsshair
    for (let i of this.maskCircles) {
        if (inCircle(i.x, i.y, e.clientX, e.clientY)) {
            // 在这个范围内 对应的手势图标
            result = `${i.cssPosition}-resize`;
        }
    }
    if (result === 'crosshair') {
        // 如果还是十字 说明不是9个点 判断是否在矩形内部
        if (inBox.call(this, e.clientX, e.clientY)) {
            result = 'all-scroll';
        }
    }

    return result;
};

export const cursorActionToBox = function(e: MouseEvent) {
    if (e.type === 'mousedown') {
        mousedown.call(this, e);
    }
};
