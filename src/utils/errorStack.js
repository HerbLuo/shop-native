/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/3/29
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/3/29 herbluo created
 */
const error = [];
export default error;


import log from './log'

export const errorHandler = {
    /**
     * 默认的错误处理方案
     */
    default(e, str) {
        log.error(str);
        error.push(e);
        throw new Error(e);
    },
    /**
     *
     * TODO 未实现
     * @param e
     * @param str
     */
    networkError(e, str) {

    }
};

