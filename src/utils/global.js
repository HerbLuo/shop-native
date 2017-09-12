/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/5/25
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/5/25 herbluo created
 */
/**
 * @type {'iOS'|'Android'|'Web'}
 */
const platform = weex.config.platform || weex.config.env.platform
const isWeb = platform === 'Web'
const isDesktop = (() => {
  try {
    if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i)) {
      return false
    }
  } catch (e) {
    return false
  }
  return true
})()

export {
  platform,
  isWeb,
  isDesktop
}
