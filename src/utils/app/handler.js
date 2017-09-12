/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/5/23
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/5/23 herbluo created
 */
import _ from 'lodash/core'
import _groupBy from 'lodash/groupBy'

_.mixin({'groupBy': _groupBy})

export const self = t => t

/**
 * 将服务器数据转化成 group数组 并返回
 *
 * 说明：服务器返回了多组数据（减少http请求数），所以需要分组
 * 该函数返回的数据可以缓存并且建议缓存
 *
 * @param key
 * @param. data 第二阶 需处理的数据
 *      （服务端数据）
 *      （如返回数据为page数据，需预处理为数组）
 */
export const group = (key = 'index') => data =>
  _.chain(data) // 服务端原始数据
    .forEach(addTimestamp) // 增加时间戳信息
    .groupBy(key) // 对数据按index进行分组
    .map(self) // 将集合对象object转换成数组对象Array
    .value()

/**
 * 过滤期满数据
 *
 * 默认期满时间为5天
 *
 * @param timeMs
 * @param. data {any []}
 */
export const expireDataFilter = (timeMs = 1000 * 60 * 60 * 24 * 5/* 五天 */) =>
  data => _.filter(data, d => new Date().getTime() - d.timestamp < timeMs)

/**
 * 增加时间戳信息
 */
export const addTimestamp = o =>
  o.timestamp || (o.timestamp = new Date().getTime())
