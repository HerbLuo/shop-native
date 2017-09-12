/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/6/28
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/6/28 herbluo created
 */
import _ from 'lodash'

/**
 * 返回一个代理，
 *
 * 慎用：注意可能不存在Proxy的垫片
 *
 * 该代理会将传入对象的
 *   所有方法的this指向重新绑定到该对象
 *
 * @author 阮一峰
 * @link http://es6.ruanyifeng.com/#docs/class#this-的指向
 */
export function selfish (target) {
  const cache = []
  const handler = {
    get (target, key) {
      const value = Reflect.get(target, key)
      if (typeof value !== 'function') {
        return value
      }
      if (!cache[value]) {
        cache[value] = value.bind(target)
      }
      return cache[value]
    }
  }
  return new Proxy(target, handler)
}

/**
 *
 * @param obj 需要判断的对象
 * @param arr ['属性', '属性.深层属性']
 */
export function hasProps (obj, arr) {
  let has = true
  arr.forEach(p => {
    /* has 为 false 直接退出 */
    has &&
    /* 不存在该属性的情况下 */ !_.has(obj, p) &&
    /* 将has置为 false */(has = false)
  })
  return has
}
