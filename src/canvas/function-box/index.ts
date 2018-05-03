/**
 * @description function box
 */
import Box from 'Canvas/box';
import { config } from 'Canvas/config';
import logger from 'Canvas/log';
import { domEach } from 'LIB/dom';

const childBoxContent: string[] = [
    'rectangular',
    'circle',
    'arrow',
    'pen',
    'text',
];
const activeBox: string[] = [
    'rectangular',
    'circle',
    'arrow',
    'pen',
    'text',
    'mosaic',
];

/**
 * default class
 */
export default class FunctionBox {
    public box: HTMLDivElement;
    public wrapBox: Box;
    public items: HTMLElement[];
    public colorItems: HTMLElement[];
    public activeFun: string;
    public activeColor: string;

    constructor(box: HTMLDivElement, wrapBox: Box) {
        this.box = box;
        this.wrapBox = wrapBox;
        this.event();
    }

    public event(): void {
        const items = this.box.querySelectorAll('.box-item');
        const childWrap = this.box.querySelector(
            '.function-box-child',
        ) as HTMLElement;
        const colorWrap = this.box.querySelector('.color-wrap') as HTMLElement;
        const colorItem = colorWrap.querySelectorAll('.color-item');
        this.items = Array.prototype.slice.call(items);
        this.colorItems = Array.prototype.slice.call(colorItem);
        const that = this;
        this.items.forEach((v: HTMLElement) => {
            v.addEventListener('click', function() {
                const type = this.getAttribute('type');
                logger(type);
                that.activeFun = type;
                that.wrapBox.currentFun = type;
                that.items.forEach((v: HTMLElement, i: number) => {
                    items[i].className = items[i].className.replace(
                        'active',
                        '',
                    );
                });
                if (activeBox.indexOf(type) !== -1) {
                    this.className += ' active';
                }
                if (childBoxContent.indexOf(type) !== -1) {
                    childWrap.style.display = 'inline-block';
                } else {
                    childWrap.style.display = 'none';
                }
                if (type === 'back') {
                    that.wrapBox.back();
                }
                if (type === 'close') {
                    config.emitter.emit('destoryed');
                }
                if (type === 'image') {
                    // that.wrapBox.uploadImage();
                }
                if (type === 'save') {
                    config.emitter.emit('shot');
                }
                config.emitter.emit('blur');
            });
        });
        if (config.plugins.indexOf('image') !== -1) {
            const uploadIcon = this.items.find((v: HTMLElement) => {
                return v.getAttribute('type') === 'image';
            });
            const input = uploadIcon.querySelector('input');
            uploadIcon.addEventListener('change', (e: Event) => {
                this.wrapBox.uploadImage(e);
            });
            config.emitter.on('image-fail', () => {
                input.value = '';
            });
        }

        this.colorItems.forEach((v: HTMLElement) => {
            v.addEventListener('click', function() {
                domEach(colorItem, (v: HTMLElement, i: number) => {
                    colorItem[i].className = colorItem[i].className.replace(
                        'active',
                        '',
                    );
                });
                this.className += ' active';
                that.activeColor = this.getAttribute('color');
                that.wrapBox.colorFun = this.getAttribute('color');
                that.wrapBox.focusItem = that.wrapBox.findFocus();
                if (that.wrapBox.focusItem) {
                    that.wrapBox.focusItem.setColor(that.wrapBox.colorFun);
                    that.wrapBox.childSaveArray.push(that.wrapBox.focusItem);
                }
            });
        });
        that.wrapBox.colorFun = colorItem[0].getAttribute('color');
        colorItem[0].className += ' active';

        config.emitter.on('destoryed', () => {
            this.wrapBox.destroyed();
        });
    }

    setColor(color: string) {
        logger(color);
        this.activeColor = color;
        this.colorItems.forEach((v: HTMLElement, i: number) => {
            const item = this.colorItems[i];
            item.className = item.className.replace('active', '');
            if (item.getAttribute('color') === color) {
                item.className += 'active';
            }
        });
    }

    remove() {
        this.box.remove();
    }
}
