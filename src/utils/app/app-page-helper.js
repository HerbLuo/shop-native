/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/9/2
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/9/2 herbluo created
 */
import dao from '../../dao'
import {createError} from '../error'

/**
 * 读取路由参数
 * @param routerName {string}
 * @return {Promise}
 */
const readRouterQuery$Promise = (routerName) => {
  return dao.get__router_query().then(({data}) => {
    let query
    try {
      query = JSON.parse(data)
    } catch (e) {
      e.config = data
      return Promise.reject(e)
    }

    if (query && query.routerName === routerName) {
      return Promise.resolve(query)
    }

    return Promise.reject(createError('无法读取路由参数', query))
  })
}

/**
 * 保存路由参数
 * @param routerName {string}
 * @param routerQuery {object}
 * @return {Promise}
 */
const saveRouterQuery$Promise = (routerName, routerQuery) => {
  if (typeof routerQuery !== 'object') {
    return Promise.reject(
      createError('参数routerQuery必须是一个对象', routerQuery))
  }

  routerQuery.routerName = routerName
  return dao.set__router_query(JSON.stringify(routerQuery))
}

/**
 * back page 返回的界面名称
 * 例如登录请求，登录成功或失败后需要返回原有界面
 * 此方法用于设置原有界面名称
 *
 * @return {Promise}
 */
const saveBackPage = (pageName) => {
  return dao.set__backpage_name(pageName)
}

/**
 * back page 返回的界面名称
 * 例如登录请求，登录成功或失败后需要返回原有界面
 * 此方法用于读取原有界面名称
 *
 * @return {Promise}
 */
const readBackPage = () => {
  return dao.get__backpage_name().then(({data}) => data)
}

export {
  readRouterQuery$Promise,
  saveRouterQuery$Promise,
  readBackPage,
  saveBackPage
}
