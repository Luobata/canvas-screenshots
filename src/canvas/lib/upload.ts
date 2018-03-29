const config = {
    type: ['png', 'ipg'],
    max: 20 * 1024,
    min: 0,
};
export default (e: Event) => {
    // 默认单张
    const file = (<HTMLInputElement>e.target).files[0];
    console.log(file);
    return file;
};
