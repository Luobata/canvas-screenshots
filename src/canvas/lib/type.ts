/**
 * @description type lib
 */

// tslint:disable no-any
export const type = (obj: any, type: string) => {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
};
export const getType = (obj: any) => {
    return Object.prototype.toString.call(obj);
};

export const getPlainObj = (obj: any) => {
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

// tslint:enable no-any
