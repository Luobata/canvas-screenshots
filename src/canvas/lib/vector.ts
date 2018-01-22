export interface vector {
    x: number;
    y: number;
}
export default class Vector {
    vector: vector;

    constructor(vector: vector) {
        this.vector = vector;
    }

    // 向量加
    add(vec: Vector): Vector {
        return new Vector({
            x: this.vector.x + vec.vector.x,
            y: this.vector.y + vec.vector.y,
        });
    }

    // 向量减
    minus(vec: Vector): Vector {
        return new Vector({
            x: this.vector.x - vec.vector.x,
            y: this.vector.y - vec.vector.y,
        });
    }

    // 向量叉积
    cross(vec: Vector): number {
        return this.vector.x * vec.vector.y - this.vector.y * vec.vector.x;
    }
}
