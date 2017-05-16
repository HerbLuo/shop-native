/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/4/28
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/4/28 herbluo created
 */

const p_util = {
    delay(delay) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay)
        })
    },
    rejectDelay(delay) {
        return new Promise((resolve, reject) => setTimeout(reject, delay));
    }
};

export default p_util;