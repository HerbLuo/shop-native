/**
 * for web and native
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/8/26
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/8/26 herbluo created
 */

import store from './store'
import mixins from './mixins'
import {rebuildVuebus} from './eventbus'

Vue.mixin(mixins)

const _rebuildVuebus = (config) => {
  rebuildVuebus({
    store,
    ...config
  })
}

_rebuildVuebus()

export default _rebuildVuebus
