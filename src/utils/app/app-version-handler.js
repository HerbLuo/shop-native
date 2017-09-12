/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/6/14
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/6/14 herbluo created
 */
function firstUpperCase (str) {
  return str[0].toUpperCase() + str.slice(1)
}

const appVersionHandler = (app) => {
  if (!app || !app.appComponentVersion || !(app.appComponentVersion instanceof Array)) {
    console.warn('参数有误')
    return
  }

  app.appComponentVersion.forEach((a) => {
    app[`app${firstUpperCase(a.name)}Version`] = a.version
  })

  app.appComponentVersion = []
}

export {
  appVersionHandler
}
