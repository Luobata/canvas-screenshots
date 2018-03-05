export const chinese = /^[\u4e00-\u9fa5]$/;
export const isChinese = (val: string) => chinese.test(val);

export const twoByte = /^[\x00-\xff]$/;
export const isTwoByte = (val: string) => twoByte.test(val);
