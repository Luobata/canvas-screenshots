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

-  Rectangular
-  Circle & Ellipsis
-  Arrow
-  Pen
-  Text
-  Mosaic
-  Image
-  Back

# Config

# Surrported browsers

-  Chrome

The browsers supported is now minimal because of the different behavior of canvas, and it will soon be more.
