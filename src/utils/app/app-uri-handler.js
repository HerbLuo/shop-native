/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @author unascribed
 * @date 2017/5/26
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/5/26 herbluo created
 */
import _forEach from 'lodash/forEach'
import {createError} from '../error'

/**
 * this code snippet is from internet
 */
const urlPraseRegex = {
  protocol: /([^/]+:)\/\/(.*)/i,
  host: /(^[^:/]+)((?:\/|:|$)?.*)/,
  port: /:?([^/]*)(\/?.*)/,
  pathname: /([^?#]+)(\??[^#]*)(#?.*)/
}

function _parseUrl (url) {
  const result = {
    href: url
  }

  _forEach(urlPraseRegex, (regex, key) => {
    let regexOut = regex.exec(url)

    result[key] = regexOut[1]
    if (key === 'pathname') {
      result.search = regexOut[2]
      result.hash = regexOut[3]
    }

    url = regexOut[2] || '/' // 下一轮循环用的url
  })

  return result
}

/**
 * 得到某个url参数（不可用于参数数组）
 * @param key 参数名
 * @param params
 * @returns {*} 参数内容 || null
 */
const urlParamGetter = (key, params) => {
  if (!key) {
    return params
  }
  params = params || window.location.search
  const result = new RegExp(key + '=([^&]*)').exec(params)
  return result === null ? null : result[1]
}

class UriConfig {
  uri // 完整uri   wxshop://router/item/?query={"id":22,"version":"2.0"}
  protocol // 协议 wxshop
  host // 主机名   router
  pathname // 主机名后面的 /item/
  search // 查询参数 ?query={"id":22,"version":"2.0"}

  constructor (uri) {
    const res = _parseUrl(uri)
    if (!res) {
      throw new Error('无法解析uri')
    }

    this.uri = uri
    this.protocol = res.protocol
    this.host = res.host
    this.pathname = res.pathname
    this.search = res.search
  }

  /**
   * @return {RouterUriConfig}
   */
  toRouterUriConfig () {
    if (this.host !== 'router') {
      throw createError('无法转换到router', this)
    }
    return new RouterUriConfig(this)
  }
}

const routerNameGetter$Regex = /^\/+(\w+)\/?/
const routerQueryGetter$Regex = /^\?query=({\S*})/

class RouterUriConfig {
  protoConfig
  routerName
  routerQuery

  constructor (protoConfig) {
    this.protoConfig = protoConfig

    let out = routerNameGetter$Regex.exec(protoConfig.pathname)
    if (!out || out.length < 2) {
      throw createError(
        '无法匹配router，可能不是router类型的uri', this.protoConfig)
    }
    this.routerName = out[1]

    out = routerQueryGetter$Regex.exec(this.protoConfig.search)
    if (out && out.length > 1) {
      this.routerQuery = JSON.parse(out[1])
    }
  }
}

export {
  UriConfig,
  urlParamGetter
}
