/**
 * @description global reg
 */

export const chinese: RegExp = /^[\u4e00-\u9fa5]$/;
export const isChinese: Function = (val: string): boolean => chinese.test(val);

// export const twoByte: RegExp = /^[\x00-\xff]$/;
// export const isTwoByte: Function = (val: string): boolean => twoByte.test(val);
