/**
 * 正则工具集
 *
 * 判断是否为url
 * 得到某个url参数
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/3/29
 * @license Licensed under the MIT license.
 * @version 1.0.0
 *
 * change logs:
 * 2017/3/29 herbluo created
 */
const util = {}


/**
 * 判断是否为url REGEX
 * @type {RegExp}
 */
const regex_isUrl = new RegExp('[a-zA-z]+://[^\s]*')
/**
 * 判断是否为url
 * @param url
 * @return {boolean}
 */
util.isUrl = function (url) {
  return regex_isUrl.test(url)
}


/**
 * 得到某个url参数（不可用于参数数组）
 *
 * @param url 可选
 * @param key 必须
 * @return {*} 参数内容 || null
 */
util.urlParamGetter = function (url, key) {
  if (typeof url !== 'string' || (key !== undefined && typeof key !== 'string')) {
    throw new Error('参数错误， 方法签名为urlParamGetter')
  }

  // 存放url 中?后面的部分字符串
  let params = ''

  // function (key)
  if (key === undefined) { //第二个参数(key) 不存在时，第一个参数(url)为key
    key = url
    params = window.location.search
  }

  // function (url, key)
  else {
    let arrayt = url.split('?')
    for (let i = 1; i < arrayt.length; i++) {
      params = params + arrayt[i]
    }
  }

  /*
   * 参数处理完毕
   */
  const result = new RegExp(key + '=([^&]*)').exec(params)
  return result === null ? null : result[1]

}

/**
 * 替换或追加某一个url参数
 * @param url 必须
 * @param key 必须
 * @param value 必须
 * @return {string}
 */
util.urlParamSetter = function (url, key, value) {
  if (url.indexOf(key) < 0) {
    // 不存在key
    return url.indexOf('?') > 0 ? `${url}&${key}=${value}` : `${url}?${key}=${value}`
  }
  return url.replace(new RegExp(`${key}=([^&]*)`), `${key}=${value}`)
}


/**
 * 导出
 */
export default util
