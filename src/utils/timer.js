/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/4/24
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/4/24 herbluo created
 */

const timerMap = [];

function interval(func, delay, id) {
    if (timerMap[id]) {
        setTimeout(() => {
            func();
            interval(func, delay, id);
        }, delay)
    }
}

export function timer(func, delay) {
    const length = timerMap.length;
    timerMap[length] = true;
    interval(func, delay, length);
    return length;
}

export function clearTimer(id) {
    timerMap[id] = false;
}
