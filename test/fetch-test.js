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

import {expect, assert} from 'chai'

// 用指定的 mutaions 测试 action 的辅助函数
const testAction = ({action, args, state, expectedMutations, done}) => {
    let count = 0

    // 模拟提交
    const commit = (type, payload) => {
        const mutation = expectedMutations[count]

        try {
            expect(mutation.type).to.equal(type)
            if (payload) {
                if (typeof mutation.payload === 'function') {
                    expect(mutation.payload(payload)).to.equal(true)
                } else {
                    expect(mutation.payload).to.deep.equal(payload)
                }
            }
        } catch (error) {
            done(error)
        }

        count++
        if (count >= expectedMutations.length) {
            done()
        }
    }

    // 用模拟的 store 和参数调用 action
    let result = action({commit, state}, ...args)

    // 检查是否没有 mutation 被 dispatch
    if (expectedMutations.length === 0) {
        expect(count).to.equal(0)
        done()
    }

    return result
}

import * as item from '../src/store/modules/item'

describe('fetch data', () => {
    describe('item', () => {

        const actions = item['default'].actions
        const getState = () => item['default'].state

        // 商品详细信息（文字描述信息）拉取测试
        it(item.FETCH_ITEM_DETAIL_DESCRIBE, (done) => {
            let state = getState()
            testAction({
                action: actions[item.FETCH_ITEM_DETAIL_DESCRIBE],
                args: [{itemId: 22}],
                state,
                expectedMutations: [{
                    type: 'SAVE_ITEM_DETAIL_DESCRIBE', payload: payload => {
                        expect(payload.itemId).to.equal(22)
                        expect(payload.describes).to.be.an('array').that.have.lengthOf(19)
                        return true
                    }
                }],
                done
            }).then().catch(error => {
                expect(error).to.equal('__ catch an error')
            })
        })


    })
})