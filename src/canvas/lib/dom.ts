export const domEach = function(arr: NodeList, fn: Function) {
    Array.prototype.forEach.call(arr, (v: HTMLElement, i: number) => {
        fn(v, i);
    });
};
