/**
 * @description blob
 */
export default (code: string): Blob => {
    function convertBase64UrlToBlob(urlData: string): Blob {
        // 去掉url的头，并转换为byte
        const bytes: string = window.atob(urlData.split(',')[1]);
        // 处理异常,将ascii码小于0的转换为大于0
        const ab: ArrayBuffer = new ArrayBuffer(bytes.length);
        const ia: Uint8Array = new Uint8Array(ab);
        for (let i: number = 0; i < bytes.length; i = i + 1) {
            ia[i] = bytes.charCodeAt(i);
        }

        return new Blob([ab], { type: 'image/png' });
    }

    return convertBase64UrlToBlob(code);
};
