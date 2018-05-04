/**
 * @description type lib
 */
// tslint:disable no-any no-unsafe-any
export const isType: Function = (obj: any, itype: string): boolean => {
    return Object.prototype.toString.call(obj) === `[object ${itype}]`;
};
export const getType: Function = (obj: any): string => {
    return Object.prototype.toString.call(obj);
};

export const getPlainObj: Function = (obj: any): any => {
    const item: any = {};
    for (const i of Object.keys(obj)) {
        // console.log(i, getType(obj[i]));
        if (
            (isType(obj[i], 'Number') ||
                isType(obj[i], 'Boolean') ||
                isType(obj[i], 'String') ||
                isType(obj[i], 'Array') ||
                isType(obj[i], 'Object')) &&
            i !== 'mouse'
        ) {
            //item[i] = JSON.parse(JSON.stringify(obj[i]));
            item[i] = obj[i];
        }
    }

    return item;
};

// tslint:enable no-any no-unsafe-any
