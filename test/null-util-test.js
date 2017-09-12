/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/7/8
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/7/8 herbluo created
 */
import {expect} from 'chai'
import {NP} from '../src/utils/null-util'
import _ from 'lodash'

describe('null-util', () => {
    describe('null propagation function test', () => {

        let testObj;
        (() => {

            function getBean() {
                return {
                    a: undefined,
                    b: null,
                    c: 0,
                    d: -1,
                    e: 1,
                    f: '',
                    g: {},
                    h: [],
                    i: [1, 2],
                    x: function (v) {
                        return v + 2
                    },
                    y: () => {
                    }
                }

            }

            testObj = {
                ...getBean(),
                o: getBean()
            }

        })()

        it('base property access is fine', () => {
            // base
            _.forEach({
                a: undefined,
                b: null,
                c: 0,
                d: -1,
                e: 1,
                f: '',
            }, (entity, key) => {
                expect(NP(testObj)[key].value).to.equal(entity)
            })
            // object and array
            expect(NP(testObj).g.value).to.deep.equal({})
            expect(NP(testObj).h.value).to.deep.equal([])
            expect(NP(testObj).i.value).to.deep.equal([1, 2])
        })

        it('property which is null or undefined could be propagation', () => {
            expect(NP(undefined).value).to.equal(undefined)
            expect(NP(undefined).u.value).to.equal(undefined)
            expect(NP(testObj).u.value).to.equal(undefined)
            expect(NP(testObj).u.u.value).to.equal(undefined)
            expect(NP(testObj).d.u.value).to.equal(undefined)
        })

        it('chain of property access is fine', () => {
            _.forEach({
                a: undefined,
                b: null,
                c: 0,
                d: -1,
                e: 1,
                f: '',
            }, (entity, key) => {
                expect(NP(testObj).o[key].value).to.equal(entity)
            })
            expect(NP(testObj).o.g.value).to.deep.equal({})
            expect(NP(testObj).o.h.value).to.deep.equal([])
            expect(NP(testObj).o.i.value).to.deep.equal([1, 2])
            expect(NP(testObj).o.e.u.value).to.equal(undefined)
        })

        it('property which is null-return function could be propagation', () => {
            expect(NP(testObj).x(-1).value).to.equal(1)
            expect(NP(testObj).x(0).value).to.equal(2)
            expect(NP(testObj).x(1).value).to.equal(3)
            expect(NP(testObj).y().value).to.equal(undefined)
            expect(NP(testObj).y().u.value).to.equal(undefined)
            expect(NP(testObj).o.x(0).value).to.equal(2)
        })



        
    })
})