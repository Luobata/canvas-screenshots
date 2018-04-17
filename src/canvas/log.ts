import { config } from './config';
export default function(...args: any[]) {
    if (config.debuggerMode) {
        if (console.trace) {
            console.trace.apply(window, arguments);
        } else {
            console.log.apply(window, arguments);
        }
    }
}
