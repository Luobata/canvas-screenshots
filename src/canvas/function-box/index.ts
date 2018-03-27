import { config } from '../config';
import { domEach } from 'LIB/dom';
import Box from '../box';

const childBoxContent = ['rectangular', 'circle', 'arrow', 'pen', 'text'];
const activeBox = [
    'rectangular',
    'circle',
    'arrow',
    'pen',
    'text',
    'mosaic',
    'image',
];
export default class FunctionBox {
    box: HTMLDivElement;
    wrapBox: Box;
    constructor(box: HTMLDivElement, wrapBox: Box) {
        this.box = box;
        this.wrapBox = wrapBox;
        this.event();
    }

    event() {
        const items = this.box.querySelectorAll('.box-item');
        const childWrap = this.box.querySelector(
            '.function-box-child',
        ) as HTMLElement;
        const colorWrap = this.box.querySelector('.color-wrap') as HTMLElement;
        const colorItem = colorWrap.querySelectorAll('.color-item');
        const that = this.wrapBox;
        Array.prototype.forEach.call(items, (v: HTMLElement) => {
            v.addEventListener('click', function() {
                that.currentFun = this.getAttribute('type');
                Array.prototype.forEach.call(items, function(
                    v: HTMLElement,
                    i: number,
                ) {
                    items[i].className = items[i].className.replace(
                        'active',
                        '',
                    );
                });
                if (activeBox.indexOf(that.currentFun) !== -1) {
                    this.className += ' active';
                }
                if (childBoxContent.indexOf(that.currentFun) !== -1) {
                    childWrap.style.display = 'inline-block';
                } else {
                    childWrap.style.display = 'none';
                }
                if (that.currentFun === 'back') {
                    that.back();
                }
                if (that.currentFun === 'close') {
                    that.destroyed();
                    config.emitter.emit('destoryed');
                }
                config.emitter.emit('blur');
            });
        });

        Array.prototype.forEach.call(colorItem, (v: HTMLElement) => {
            v.addEventListener('click', function() {
                domEach(colorItem, (v: HTMLElement, i: number) => {
                    colorItem[i].className = colorItem[i].className.replace(
                        'active',
                        '',
                    );
                });
                this.className += ' active';
                that.colorFun = this.getAttribute('color');
                that.focusItem = that.findFocus();
                if (that.focusItem) {
                    that.focusItem.setColor(that.colorFun);
                    that.childSaveArray.push(that.focusItem);
                }
            });
        });
        that.colorFun = colorItem[0].getAttribute('color');
        colorItem[0].className += ' active';
    }

    remove() {
        this.box.remove();
    }
}
