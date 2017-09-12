/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/7/7
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/7/7 herbluo created
 */

function nullable (target) {

  target = {value: target}

  let handler = {
    get: function (target, key, receiver) {
      let targetValue = Reflect.get(target, 'value', receiver)

      if (key === 'value') {
        return targetValue
      }

      if (targetValue === null) {
        return nullable(null)
      }

      if (typeof targetValue !== 'object') {
        return nullable(undefined)
      }

      let valueValue = Reflect.get(targetValue, key, receiver)

      if (typeof valueValue === 'function') {
        return (...args) => {
          return nullable(valueValue(...args))
        }
      }

      return nullable(valueValue)
    },
    set: function () {
      // 暂不支持
    }
  }

  return new Proxy(target, handler)
}

function TRY (func) {
  try {
    return func()
  } catch (e) {
  }
}

/**
 * null propagation
 * null 传导
 *
 * 用法1(注意Proxy)
 * 允许 NP(null || undefined).uuu.uuu
 * 允许 NP({}).uuu.uuu.u.u
 *
 * 用法2
 * 允许 NP(() => undefined.u.uu.u)
 *
 */
export function NP (obj) {
  if (typeof obj === 'function') {
    return TRY(obj)
  }
  return nullable(obj)
}
