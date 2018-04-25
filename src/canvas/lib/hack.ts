import { Content } from 'LIB/interface';
import { addDebuggerData, deleteDebuggerData } from '../log';
export const hackArray = () => {};
export const hackSet = function(set: Set<Content>) {
    const addFun = set.add;
    const deleteFun = set.delete;
    set.add = function() {
        const item = Array.prototype.slice.call(arguments)[0];
        addDebuggerData(item);
        return addFun.apply(set, arguments);
    };
    set.delete = function() {
        const item = Array.prototype.slice.call(arguments)[0];
        deleteDebuggerData(item);
        return deleteFun.apply(set, arguments);
    };
};
