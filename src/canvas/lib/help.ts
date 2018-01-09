import { Rect } from 'LIB/interface';

export const getCircleMap = (obj: Rect, borderWidth: number) => {
    const circleMap = [
        {
            x: obj.startX - borderWidth,
            y: obj.startY - borderWidth,
            position: 'left-top',
            cssPosition: 'nw',
        },
        // left-bottom
        {
            x: obj.startX - borderWidth,
            y: obj.endY + borderWidth,
            position: 'left-botoom',
            cssPosition: 'sw',
        },
        // left-middle
        {
            x: obj.startX - borderWidth,
            y: obj.startY + (obj.endY - obj.startY) / 2,
            position: 'left-middle',
            cssPosition: 'w',
        },
        // middle top
        {
            x: obj.startX + (obj.endX - obj.startX) / 2,
            y: obj.startY - borderWidth,
            position: 'middle-top',
            cssPosition: 'n',
        },
        // middle bottom
        {
            x: obj.startX + (obj.endX - obj.startX) / 2,
            y: obj.endY + borderWidth,
            position: 'middle-bottom',
            cssPosition: 's',
        },
        // right top
        {
            x: obj.endX + borderWidth,
            y: obj.startY - borderWidth,
            position: 'right-top',
            cssPosition: 'ne',
        },
        // right bottom
        {
            x: obj.endX + borderWidth,
            y: obj.endY + borderWidth,
            position: 'right-bottom',
            cssPosition: 'se',
        },
        // right middle
        {
            x: obj.endX + borderWidth,
            y: obj.startY + (obj.endY - obj.startY) / 2,
            position: 'right-middle',
            cssPosition: 'e',
        },
    ];

    return circleMap;
};
