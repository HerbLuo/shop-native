/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @author unascribed
 * @date 2017/5/26
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/5/26 herbluo created
 */


/**
 * this code snippet is from internet
 */
const urlPraseRegex = {
    protocol: /([^\/]+:)\/\/(.*)/i,
    host: /(^[^:\/]+)((?:\/|:|$)?.*)/,
    port: /:?([^\/]*)(\/?.*)/,
    pathname: /([^?#]+)(\??[^#]*)(#?.*)/
};

export function parseUrl(url) {
    const res = {
        href: url
    };

    for (let p in urlPraseRegex) {
        let tmp = urlPraseRegex[p].exec(url);

        res[p] = tmp[1];
        url = tmp[2] || '/';

        if (p === "pathname") {
            [, res.pathname, res.search, res.hash] = tmp;
        }
    }
    return res;
}


/**
 * 得到某个url参数（不可用于参数数组）
 * @param key 参数名
 * @param params
 * @returns {*} 参数内容 || null
 */
export function urlParamGetter(key, params) {
    if (!key) {
        return params;
    }
    params = params || window.location.search;
    const result = new RegExp(key + "=([^&]*)").exec(params);
    return result === null ? null : result[1];
}

