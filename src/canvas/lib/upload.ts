import logger from '../log';
const config = {
    type: ['png', 'jpg', 'jpeg'],
    max: 100 * 1024,
    min: 0,
};
const validateType = (type: string) => {
    return config.type.indexOf(type.replace('image/', '')) !== -1;
};
const validateSize = (size: number) => {
    return size >= config.min && size <= config.max;
};
export default (e: Event) => {
    // 默认单张
    const file = (<HTMLInputElement>e.target).files[0];
    const error = {
        code: 0,
        msg: '',
    };
    if (!validateType(file.type)) {
        error.code = 1;
        error.msg = '图片格式不正确';
        return error;
    }
    if (!validateSize(file.size)) {
        error.code = 2;
        error.msg = '图片大小不符合要求';
        return error;
    }
    logger(file);
    return file;
};
