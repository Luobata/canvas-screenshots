/**
 * @description geometric
 */
import { Position } from 'LIB/interface';
import Vector, { Ivector } from 'LIB/vector';

// 点是否在矩形内
// p1左上 p2右上 p3左下 p4右下
export const pointInRectangular: Function = (
    p1: Ivector,
    p2: Ivector,
    p3: Ivector,
    p4: Ivector,
    p: Ivector,
): boolean => {
    const P1: Vector = new Vector(p1);
    const P2: Vector = new Vector(p2);
    const P3: Vector = new Vector(p3);
    const P4: Vector = new Vector(p4);
    const P: Vector = new Vector(p);

    const P1P3: Vector = P3.minus(P1);
    const P1P: Vector = P.minus(P1);
    const P2P4: Vector = P4.minus(P2);
    const P2P: Vector = P.minus(P2);
    const P1P2: Vector = P2.minus(P1);
    const P3P4: Vector = P4.minus(P3);
    const P3P: Vector = P.minus(P4);

    return (
        P1P3.cross(P1P) * P2P4.cross(P2P) < 0 &&
        P1P2.cross(P1P) * P3P4.cross(P3P) < 0
    );
};

export const pointInArea: Function = (
    positions: Position[],
    point: Position,
): boolean => {
    // 只对凸多边形有用 凹多边形有bug
    if (positions.length < 3) {
        return false;
    }

    let total: number = 0;
    for (let i: number = 0; i < positions.length; i = i + 1) {
        let start: Position;
        let next: Position;
        if (i === positions.length - 1) {
            // 最后一个
            start = positions[i];
            next = positions[0];
        } else {
            start = positions[i];
            next = positions[i + 1];
        }
        const P1: Vector = new Vector({
            x: start.x - point.x,
            y: start.y - point.y,
        });
        const P2: Vector = new Vector({
            x: next.x - point.x,
            y: next.y - point.y,
        });
        total += P1.ankle(P2);
    }

    // logger(total);
    const margin: number = 0.05;

    return Math.abs(total / 360 - 1) < margin;
};

/**
 *
 * @param posions 线的点位置集合
 * @param pos 点的位置
 * @param margin  距离最大值 该值内认为在线上
 */
export const pointInLine: Function = (
    positions: Position[],
    pos: Position,
    margin: number,
): boolean => {
    for (const i of positions) {
        const vec: Vector = new Vector({ x: i.x - pos.x, y: i.y - pos.y });
        if (vec.mod() <= margin) {
            return true;
        }
    }

    return false;
};
