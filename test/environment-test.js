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
import {assert} from 'chai'

describe('environment', () => {
    it('this is a browser environment', () => {
        assert.isTrue(!!window)
    })
    it('Vue is declared', () => {
        assert.isTrue(!!Vue)
    })
    it('axios is functioned', () => {
        assert.typeOf(Vue.axios, 'function')
    })
})