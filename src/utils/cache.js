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
const LRU = require('lru-cache')
const options = {
  max: 50,
  maxAge: 1000 * 60 * 10 // 10分钟
}
const cache = LRU(options)

export default cache

// only for de_warn
// eslint-disable-next-line
if (0) {
  let cacheT = cache
  cache.get = cacheT.get
  cache.set = cacheT.set
}
