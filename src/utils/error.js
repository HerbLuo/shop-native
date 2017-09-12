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
import './log'

/* *********
 error code
 ********* */
const errorCode = {
  /* *********
   run time exception: 1xxx
   ********* */
  'IllegalArgument': ['1001', '参数错误'],
  'ParseJsonError': ['1002', '解析json失败'],
  /* *********
   network error: 2xxx
   ********* */
  'NetworkError': ['2000', '网络连接错误'],
  'ServerError': ['2001', '服务端返回错误的结果']
}

/* *********
 错误处理方案
 ********* */
const errorHandler = {
  /* *********
   global
   ********* */
  /**
   * 默认的错误处理方案
   */
  default (e, str) {
  },
  /* *********
   network
   ********* */
  /**
   * 检查网络是否良好
   *
   * TODO 未实现
   * @return {Promise}
   */
  isNetWorkFine$Promise () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  },
  /**
   * 等待网络通畅
   * 顺便尝试解决 网络链接错误
   *
   * TODO 未实现
   * @return {Promise.<resolve>} when net is open
   */
  waitWhileNetworkIsOpen$Promise () {
    return new Promise((resolve, reject) => {
      console.log('请检查网络链接')
    })
  },
  /**
   * 检查网络是否通畅
   * 如不通畅，尝试解决并等待通畅
   *
   * @return {Promise.<*>} resolve when network is fine,
   *                       reject when network is reopen
   */
  checkNetworkAndWaitWhileNetworkIsReopen$Promise () {
    return this.isNetWorkFine$Promise()
      .then(::Promise.resolve) // made ,这里被坑了
      .catch((e) => {
        if (e) {
          console.error(e)
        }
        return this.waitWhileNetworkIsOpen$Promise()
          .then(::Promise.reject)
      })
  }
  /* *********
  
   ********* */
}

/**
 * @param errorStr {string}
 * @param errorData {object}
 * @return {Error}
 */
const createError = (errorStr, errorData) => {
  const error = new Error(errorStr)
  error.config = errorData
  return error
}
/* *********
 export
 ********* */

export {
  errorCode,
  errorHandler,
  createError
}
