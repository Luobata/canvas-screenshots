/**
 * @description dom util
 */

// tslint:disable no-function-expression
export const domEach: Function = function(arr: NodeList, fn: Function): void {
    Array.prototype.forEach.call(arr, (v: HTMLElement, i: number) => {
        fn(v, i);
    });
};
