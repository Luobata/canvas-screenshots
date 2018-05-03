/**
 * @description type lib
 */
// tslint:disable no-any no-unsafe-any
export const type: Function = (obj: any, type: string): boolean => {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
};
export const getType: Function = (obj: any): string => {
    return Object.prototype.toString.call(obj);
};

export const getPlainObj: Function = (obj: any): any => {
    const item: any = {};
    for (let i of Object.keys(obj)) {
        // console.log(i, getType(obj[i]));
        if (
            (type(obj[i], 'Number') ||
                type(obj[i], 'Boolean') ||
                type(obj[i], 'String') ||
                type(obj[i], 'Array') ||
                type(obj[i], 'Object')) &&
            i !== 'mouse'
        ) {
            //item[i] = JSON.parse(JSON.stringify(obj[i]));
            item[i] = obj[i];
        }
    }
    return item;
};

// tslint:enable no-any no-unsafe-any
