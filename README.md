# canvas-screenshots

canvas-screenshots is a useful screenshots tools on your website created by canvas.The behavior is similar with your Pc clients like wechat or QQ.

# Installation

```js
npm install --save-dev canvas-screenshots
```

#Usage

```js
import ScreenShoots from 'canvas-screenshots';

// generate a screenshots
const screen = new ScreenShoots({
    download: data => {
        console.log(data);
    },
});

// create mask above
screen.start();
```

# Surrpoted fcuntions

1.  Rectangular
2.  Circle & Ellipsis
3.  Arrow
4.  Pen
5.  Text
6.  Mosaic
7.  Image
8.  Back

# Config

# Surrported browsers

1.  Chrome

The browsers supported is now minimal because of the different behavior of canvas, and it will soon be more.
