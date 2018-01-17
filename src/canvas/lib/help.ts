import { Rect, Circle } from 'LIB/interface';

export const changeVal = (obj: any, keyA: string, keyB: string) => {
    const tmp = obj[keyA];
    obj[keyA] = obj[keyB];
    obj[keyB] = tmp;
};

export const getCircleMap = (obj: Rect, borderWidth: number) => {
    // 转向后 翻转
    const dir = (dirX: string, dirY: string) => {
        const positiveX = obj.startX < obj.endX;
        const positiveY = obj.startY < obj.endY;
        let res = '';

        switch (dirY) {
            case 'top':
                if (positiveY) {
                    res += 'n';
                } else {
                    res += 's';
                }
                break;
            case 'middle':
                break;
            case 'bottom':
                if (positiveY) {
                    res += 's';
                } else {
                    res += 'n';
                }
                break;
            default:
                break;
        }

        switch (dirX) {
            case 'left':
                if (positiveX) {
                    res += 'w';
                } else {
                    res += 'e';
                }
                break;
            case 'right':
                if (!positiveX) {
                    res += 'w';
                } else {
                    res += 'e';
                }
                break;
            case 'middle':
                break;
            default:
                break;
        }

        return res;
    };

    const circleMap = [
        {
            x: obj.startX - borderWidth,
            y: obj.startY - borderWidth,
            position: 'left-top',
            //cssPositionEve: 'nw',
            cssPosition: dir('left', 'top'),
        },
        // left-bottom
        {
            x: obj.startX - borderWidth,
            y: obj.endY + borderWidth,
            position: 'left-botoom',
            //cssPositionEve: 'sw',
            cssPosition: dir('left', 'bottom'),
        },
        // left-middle
        {
            x: obj.startX - borderWidth,
            y: obj.startY + (obj.endY - obj.startY) / 2,
            position: 'left-middle',
            //cssPositionEve: 'w',
            cssPosition: dir('left', 'middle'),
        },
        // middle top
        {
            x: obj.startX + (obj.endX - obj.startX) / 2,
            y: obj.startY - borderWidth,
            position: 'middle-top',
            //cssPosition: 'n',
            cssPosition: dir('middle', 'top'),
        },
        // middle bottom
        {
            x: obj.startX + (obj.endX - obj.startX) / 2,
            y: obj.endY + borderWidth,
            position: 'middle-bottom',
            //cssPosition: 's',
            cssPosition: dir('middle', 'bottom'),
        },
        // right top
        {
            x: obj.endX + borderWidth,
            y: obj.startY - borderWidth,
            position: 'right-top',
            //cssPosition: 'ne',
            cssPosition: dir('right', 'top'),
        },
        // right bottom
        {
            x: obj.endX + borderWidth,
            y: obj.endY + borderWidth,
            position: 'right-bottom',
            //cssPosition: 'se',
            cssPosition: dir('right', 'bottom'),
        },
        // right middle
        {
            x: obj.endX + borderWidth,
            y: obj.startY + (obj.endY - obj.startY) / 2,
            position: 'right-middle',
            //cssPosition: 'e',
            cssPosition: dir('right', 'middle'),
        },
    ];

    return circleMap;
};

export const getCircleMapWithCircle = (obj: Circle, borderWidth: number) => {
    const positiveX = () => {};
    const circleMap = [
        {
            x: obj.centerX - obj.radiusX - borderWidth,
            y: obj.centerY - obj.radiusY - borderWidth,
            position: 'left-top',
            cssPosition: 'nw',
        },
        // left-bottom
        {
            x: obj.centerX - obj.radiusX - borderWidth,
            y: obj.centerY + obj.radiusY + borderWidth,
            position: 'left-botoom',
            cssPosition: 'sw',
        },
        // left-middle
        {
            x: obj.centerX - obj.radiusX - borderWidth,
            y: obj.centerY,
            position: 'left-middle',
            cssPosition: 'w',
        },
        // middle top
        {
            x: obj.centerX,
            y: obj.centerY - obj.radiusY - borderWidth,
            position: 'middle-top',
            cssPosition: 'n',
        },
        // middle bottom
        {
            x: obj.centerX,
            y: obj.centerY + obj.radiusY + borderWidth,
            position: 'middle-bottom',
            cssPosition: 's',
        },
        // right top
        {
            x: obj.centerX + obj.radiusX + borderWidth,
            y: obj.centerY - obj.radiusY - borderWidth,
            position: 'right-top',
            cssPosition: 'ne',
        },
        // right bottom
        {
            x: obj.centerX + obj.radiusX + borderWidth,
            y: obj.centerY + obj.radiusY + borderWidth,
            position: 'right-bottom',
            cssPosition: 'se',
        },
        // right middle
        {
            x: obj.centerX + obj.radiusX + borderWidth,
            y: obj.centerY,
            position: 'right-middle',
            cssPosition: 'e',
        },
    ];

    return circleMap;
};
