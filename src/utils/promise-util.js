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
// Promise.prototype.log = function () {
//   let P = this.constructor
//   return this.then(
//     value => P.resolve().then(() => value),
//     reason => P.resolve(log.error(reason)).then(() => {
//       throw reason
//     })
//   )
// }
//
// /**
//  * Promise对象的回调链，
//  * 不管以then方法或catch方法结尾，
//  * 要是最后一个方法抛出错误，
//  * 都有可能无法捕捉到（因为Promise内部的错误不会冒泡到全局）。
//  * 因此，我们可以提供一个done方法，
//  * 总是处于回调链的尾端，
//  * 保证抛出任何可能出现的错误。
//  *
//  * @author ruanyifeng
//  * @see http://es6.ruanyifeng.com/#docs/promise#两个有用的附加方法
//  * @param onFulfilled
//  * @param onRejected
//  */
// Promise.prototype.done = function (onFulfilled, onRejected) {
//   this.then(onFulfilled, onRejected)
//     .catch(function (reason) {
//       // 抛出一个全局错误
//       setTimeout(() => {
//         throw reason
//       }, 0)
//     })
// }
// /**
//  * finally方法用于指定不管Promise对象最后状态如何，
//  * 都会执行的操作。
//  * 它与done方法的最大区别，它接受一个普通的回调函数作为参数，
//  * 该函数不管怎样都必须执行。
//  *
//  * @author ruanyifeng
//  * @see http://es6.ruanyifeng.com/#docs/promise#两个有用的附加方法
//  * @param callback
//  * @return {Promise.<*>}
//  */
// Promise.prototype.finally = function (callback) {
//   let P = this.constructor
//   return this.then(
//     value => P.resolve(callback()).then(() => value),
//     reason => P.resolve(callback()).then(() => {
//       throw reason
//     })
//   )
// }

const pUtil = {
  delay (delay) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay)
    })
  },
  rejectDelay (delay) {
    return new Promise((resolve, reject) => setTimeout(reject, delay))
  }
}

export default pUtil
