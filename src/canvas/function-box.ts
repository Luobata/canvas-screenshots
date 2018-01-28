const tpl = require('./function-box.pug');
import './function-box.styl';

export default (parent: HTMLElement) => {
    const div = document.createElement('div');
    const item = [
        {
            className: 'rectangular',
        },
        {
            className: 'circle',
        },
    ];
    const prefix = 'screen-shoot';
    const tmpl = tpl({
        item,
        prefix,
    });
    console.log(tmpl);
    div.style.position = 'absolute';
    div.id = `#${prefix}`;
    div.innerHTML = tmpl;

    parent.appendChild(div);

    return div;
};
