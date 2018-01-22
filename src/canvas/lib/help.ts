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
            cssPositionEve: 'nw',
            cssPosition: dir('left', 'top'),
        },
        // left-bottom
        {
            x: obj.startX - borderWidth,
            y: obj.endY + borderWidth,
            position: 'left-botoom',
            cssPositionEve: 'sw',
            cssPosition: dir('left', 'bottom'),
        },
        // left-middle
        {
            x: obj.startX - borderWidth,
            y: obj.startY + (obj.endY - obj.startY) / 2,
            position: 'left-middle',
            cssPositionEve: 'w',
            cssPosition: dir('left', 'middle'),
        },
        // middle top
        {
            x: obj.startX + (obj.endX - obj.startX) / 2,
            y: obj.startY - borderWidth,
            position: 'middle-top',
            cssPositionEve: 'n',
            cssPosition: dir('middle', 'top'),
        },
        // middle bottom
        {
            x: obj.startX + (obj.endX - obj.startX) / 2,
            y: obj.endY + borderWidth,
            position: 'middle-bottom',
            cssPositionEve: 's',
            cssPosition: dir('middle', 'bottom'),
        },
        // right top
        {
            x: obj.endX + borderWidth,
            y: obj.startY - borderWidth,
            position: 'right-top',
            cssPositionEve: 'ne',
            cssPosition: dir('right', 'top'),
        },
        // right bottom
        {
            x: obj.endX + borderWidth,
            y: obj.endY + borderWidth,
            position: 'right-bottom',
            cssPositionEve: 'se',
            cssPosition: dir('right', 'bottom'),
        },
        // right middle
        {
            x: obj.endX + borderWidth,
            y: obj.startY + (obj.endY - obj.startY) / 2,
            position: 'right-middle',
            cssPositionEve: 'e',
            cssPosition: dir('right', 'middle'),
        },
    ];

    return circleMap;
};
