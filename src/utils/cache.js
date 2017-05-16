/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/4/18
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/4/18 herbluo created
 */
const LRU = require('lru-cache'),
    options = {
        max: 50,
        maxAge: 1000 * 60 * 10 //10分钟
    },
    cache = LRU(options);

export default cache;

// only for de_warn
if (0) {
    let cache_t = cache;
    cache.get = cache_t.get;
    cache.set = cache_t.set;
}
