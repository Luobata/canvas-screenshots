import Vector, { vector } from 'LIB/vector';

// 点是否在矩形内
// p1左上 p2右上 p3左下 p4右下
export const pointInRectangular = (
    p1: vector,
    p2: vector,
    p3: vector,
    p4: vector,
    p: vector,
) => {
    const P1 = new Vector(p1);
    const P2 = new Vector(p2);
    const P3 = new Vector(p3);
    const P4 = new Vector(p4);
    const P = new Vector(p);

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
