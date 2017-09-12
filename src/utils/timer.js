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

const timerMap = []

function interval (func, delay, id) {
  if (timerMap[id]) {
    setTimeout(() => {
      func()
      interval(func, delay, id)
    }, delay)
  }
}

/**
 * interval 兼容函数
 */
export function timer (func, delay) {
  const length = timerMap.length
  timerMap[length] = true
  interval(func, delay, length)
  return length
}

export function clearTimer (id) {
  timerMap[id] = false
}

/**
 * 返回一个超时的reject
 */
export function getATimeoutReject (time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('timeout')), time)
  })
}

/**
 * 返回一个超时的resolve
 */
export function getATimeoutResolve (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

/**
 * .....与timeout竞争
 * @param promise
 * @param time
 * @return {Promise.<*>}
 */
export function raceWithTimeout (promise, time) {
  return Promise.race([promise, getATimeoutReject(time)])
}
