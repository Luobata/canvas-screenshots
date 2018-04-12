import ScreenShoot from './canvas/screen';
import { plugins } from 'LIB/interface';

module.exports = ScreenShoot;
// export default ScreenShoot;
// export default () => {
//     let screen: ScreenShoot;
//     window.onload = () => {
//         screen = new ScreenShoot({
//             // plugins: [plugins.rectangular, plugins.circle],
//             download: (data: ImageData) => {
//                 console.log(data);
//             },
//             imageFail: (error: object) => {
//                 console.log(error);
//             },
//         });
//         screen.start();
//     };
//     (<any>window).xxxx = () => {
//         screen.start();
//     };
// };
