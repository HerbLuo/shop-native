/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/8/21
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/8/21 herbluo created
 */

import '../src/utils/log'

describe('log', () => {
    it('please open the console and see the output', () => {

        console.log('%cthe color is blue', 'color:blue')
        console.log({msg: 'this is an object'})

        console.info('this is an info')

        console.warn('this is a warn')
        console.warn(new Error('this is an error warn'))
        console.warn({msg: 'this is an object warn'})

        console.error('this is an error and with a dialog show')

    })
})