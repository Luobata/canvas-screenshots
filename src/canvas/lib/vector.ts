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

    dot(vec: Vector): number {
        return this.vector.x * vec.vector.x + this.vector.y * vec.vector.y;
    }

    // 向量叉积
    cross(vec: Vector): number {
        return this.vector.x * vec.vector.y - this.vector.y * vec.vector.x;
    }

    // 向量模
    mod(): number {
        return Math.sqrt(
            Math.pow(this.vector.x, 2) + Math.pow(this.vector.y, 2),
        );
    }

    // 向量之间夹角
    ankle(vec: Vector): number {
        const result =
            Math.acos(this.dot(vec) / (this.mod() * vec.mod())) * 180 / Math.PI;
        return result > 180 ? result - 180 : result;
    }
}
