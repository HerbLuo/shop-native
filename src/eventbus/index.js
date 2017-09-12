/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/4/27
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/4/27 herbluo created
 */
/**
 * vue 的一个公交车
 * 管理一些简单事件
 */
let vuebus = new Vue()

const rebuildVuebus = (config) => {
  vuebus = new Vue(config)
}

export {
  /*
   * TODO WARNING `THE MUTABLE EXPORT`,
   * TODO YOU COULD CHANGE IT ONLY BY `rebuildVuebus`
   */
  vuebus,
  rebuildVuebus
}
