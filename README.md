# canvas-screenshots

canvas-screenshots is a useful screenshots tools on your website created by canvas.The behavior is similar with your Pc clients like wechat or QQ.

## Installation

```js
npm install --save-dev canvas-screenshots
```

## Usage

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

## Demo

[demo](https://luobata.github.io/canvas-screenshots/test.html)

## Surrpoted fcuntions

*   Rectangular
*   Circle & Ellipsis
*   Arrow
*   Pen
*   Text
*   Mosaic
*   Image
*   Back

## Config

- plugins

  ```js
  The switch to each function.
  type: Array<pluginType> 
  (pluginType: 'rectangular' || 'circle' || 'arrow' || 'pen' || 'text' || 'mosaic' || 'image' || 'back')
  default: Array<all pluginType>
  ```

- download

  ```js
  Trigger when click the download button, the type of output data will be decided by config type.
  type: Function
  default: noop function
  arguments: data
  ```

- imageFail

  ```js
  Trigger when choose a image but not match the expected.
  type: Function
  default: noop function
  arguments: error
  ```

- debuggerMode

  ```js
  debugger switch.
  type: boolean
  default: false
  ```

- type

  ```js
  The output type with download.
  type: string('imageData' || 'png')
  default: 'imageData'
  ```

## Surrported browsers

*   Chrome

The browsers supported is now minimal because of the different behavior of canvas, and it will soon be more.
