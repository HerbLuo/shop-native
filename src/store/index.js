/**
 * 所有mutation事件类型必带后缀 MUTATION
 * 常见的action前缀有 FETCH 等； 如无，则必带后缀 ACTION
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/4/22
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/4/22 herbluo created
 */

/* *********
 import
 ********* */
import Vuex from 'vuex'
import {isWeb} from '../utils/global'

isWeb || Vue.use(Vuex)

const store = new Vuex.Store({})

const registerModuleIfNotExist = (moduleName, module) => {
  if (!store.state[moduleName]) {
    store.registerModule(moduleName, module)
  }
}

export default store
export {
  registerModuleIfNotExist
}
