const tpl = require('./function-box.pug');

export default (parent: HTMLElement) => {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    return div;
};
