/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/6/30
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/6/30 herbluo created
 */
// Vue.axios
const axios = require('../src/utils/vendors/axios/lib/axios')
if (window) {
    window['Vue'] = {axios}
}

import 'weex-vue-render'