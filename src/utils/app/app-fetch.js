/**
 * fetch的拓展
 *
 * 部分源码参考 Axios
 * 这是它的许可证
 * Copyright (c) 2014 Matt Zabriskie

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/8/31
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/8/31 herbluo created
 */
const stream = weex.requireModule('stream')

const beforeRequest = (config) => {
  const body = config.body
  if (body) {
    if (typeof body === 'object') {
      config.body = JSON.stringify(body)
    }
    if (typeof config.body !== 'string') {
      return false
    }
  }
  return true
}

const afterResponse = (response) => {
  let data = response.data
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) { /* Ignore */
    }
  }
  response.data = data
}

const settle = (resolve, reject, response) => {
  if (response.status && response.ok) {
    resolve(response)
  } else {
    const error = new Error(
      `Request failed with status code ${response.status}`)
    error.code = response.code
    error.response = response
    reject(error)
  }
}

/**
 * @param config {{method, url, type?}}
 * @return {Promise}
 */
const request = (config) => {
  if (!beforeRequest(config)) {
    return Promise.reject(new Error('请求参数错误'))
  }

  const method = config.method
  const url = config.url
  const type = config.type || 'json'

  return new Promise((resolve, reject) => {
    stream.fetch({method, url, type}, (response) => {
      afterResponse(response)
      settle(resolve, reject, response)
    })
  })
}

/**
 * @return {Promise}
 */
const get = (url) => {
  return request({
    method: 'get',
    url
  })
}

/**
 * @param url {string}
 * @param [body] {object}
 * @return {Promise}
 */
const post = (url, body) => {
  return request({
    method: 'post',
    url,
    body
  })
}

export {
  get,
  post
}
