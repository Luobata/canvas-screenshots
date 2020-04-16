/**
 * @description Vector
 */
export interface Ivector {
    x: number;
    y: number;
}
/**
 * default class Vector
 */
export default class Vector {
    vector: Ivector;
    constructor(vector: Ivector);
    add(vec: Vector): Vector;
    minus(vec: Vector): Vector;
    dot(vec: Vector): number;
    cross(vec: Vector): number;
    mod(): number;
    ankle(vec: Vector): number;
}
