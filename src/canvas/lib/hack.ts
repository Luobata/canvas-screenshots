/**
 * @description hack method
 */
import { addDebuggerData, deleteDebuggerData } from 'Canvas/log';
import { Content } from 'LIB/interface';

// tslint:disable no-function-expression no-any no-unsafe-any
export const hackArray: Function = (arr: Content[]): void => {
    // TODO
};
export const hackSet: Function = function(cset: Set<Content>): void {
    const addFun: Function = cset.add;
    const deleteFun: Function = cset.delete;

    cset.add = function(): any {
        const item: any = Array.prototype.slice.call(arguments)[0];
        addDebuggerData(item);

        return addFun.apply(cset, arguments);
    };
    cset.delete = function(): any {
        const item: any = Array.prototype.slice.call(arguments)[0];
        deleteDebuggerData(item);

        return deleteFun.apply(cset, arguments);
    };
};
