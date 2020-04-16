import { Config } from 'LIB/interface';
/**
 * a default class
 */
export default class Screen {
    private config;
    private body;
    private transMask;
    private transMaskCtx;
    private mask;
    private maskCtx;
    private offMask;
    private offMaskCtx;
    private shootBox;
    private show;
    private beginMove;
    private functionBox;
    private imageFailListener;
    private drawAllListener;
    private resizeListener;
    private mouseDownListener;
    private mouseMoveListener;
    private mouseUpListener;
    private keyUpListener;
    private drawListener;
    private destoryedListener;
    private shotListener;
    private blurListener;
    private cursorChangeListener;
    private cursorStyle;
    private clickTime;
    private box;
    constructor(conf: Config);
    private platform;
    private hackBody;
    private initBackGround;
    private reset;
    private resize;
    private functionBoxPos;
    private initEvent;
    private beginBox;
    private drawBox;
    private screenShots;
    private start;
    private destroyed;
    private blur;
    private globaldraw;
    private drawAll;
}
