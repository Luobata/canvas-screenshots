/**
 * @description upload
 */
import logger from 'Canvas/log';
interface Ierror {
    code: number;
    msg: string;
}
interface Iconfig {
    fileType: string[];
    max?: number;
    min?: number;
}

const config: Iconfig = {
    fileType: ['png', 'jpg', 'jpeg'],
    max: 100 * 1024,
    min: 0,
};
const validateType: Function = (fileType: string): boolean => {
    return config.fileType.indexOf(fileType.replace('image/', '')) !== -1;
};
const validateSize: Function = (size: number): boolean => {
    return size >= config.min && size <= config.max;
};

/**
 * default upload
 */
export default (e: Event): File | Ierror => {
    // 默认单张
    const file: File = (<HTMLInputElement>e.target).files[0];
    const error: Ierror = {
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
