<!--
    
    @author herbluo
    change logs:
    2017/4/25 herbluo created
-->
<!--suppress JSUnresolvedVariable -->
<template>
    <div class="cheap">
        <split-bar></split-bar>
        <div class="row head">
            <div class="rel" v-for="headBlock in block.head">
                <image :src="headBlock.img" :class="['image-' + headBlock.type]"></image>
                <text v-if="headBlock.type === 'left'" class="text-left">{{headBlock.text}}</text>
                <div v-if="headBlock.type === 'right'" class="text-right-bg">
                    <text class="text-right-text">{{headBlock.text}}</text>
                </div>
            </div>
        </div>
        <div class="title">
            <text class="title-text">{{block.title}}</text>
        </div>
        <div class="content">
            <div v-for="row in block.content" class="row">
                <div v-for="item in row">
                    <image
                            class="content-image"
                            :src="item.img"
                    ></image>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .rel {
        position: relative;
    }

    .cheap {
        position: relative;
    }

    .row {
        flex-direction: row;
        width: 750px;
        justify-content: space-between;
    }

    /*noinspection CssUnusedSymbol*/
    .image-left {
        width: 499px;
        height: 250px;
    }

    /*noinspection CssUnusedSymbol*/
    .image-right {
        width: 250px;
        height: 250px;
    }

    .title {
        position: absolute;
        left: -29px;
        top: 0;
        align-items: center;
        justify-content: center;
        width: 229px;
        height: 58px;
        border-radius: 29px;
        background-image: linear-gradient(to right, #FF0, #FFBC00);
    }

    .title-text {
        color: white;
        font-size: 34px;
        margin-left: 15px;
    }

    .text-left, .text-right-text {
        color: white;
        font-size: 26px;
    }

    .text-left {
        position: absolute;
        bottom: 20px;
        left: 20px;
    }

    .text-right-bg {
        position: absolute;
        bottom: 18px;
        left: 40px;
        width: 170px;
        height: 38px;
        align-items: center;
        justify-content: center;
        border-top-left-radius: 19px;
        border-bottom-right-radius: 19px;
        background-color: rgba(255, 175, 0, 0.7);
    }

    .content {
        background-color: #e8e8e8;
        justify-content: space-between;
        height: 492px;
    }

    .content-image {
        width: 374px;
        height: 245px;
    }
</style>

<script>
    import SplitBar from "./SplitBar.vue";

    const _ = require('lodash');
    import api from '../../api/'
    import dao from "../../dao/";
    import log from '../../utils/log'
    import loadingState from '../../utils/LoadingState'
    import {ON_HOME_REFRESHING} from "../../store/mutation-action";
    import {errorHandler} from "../../utils/errorStack";
    import loader from '../../utils/shop-native/loader'
    import blockHandler, {
        cache,
        DataContainer
    } from '../../utils/shop-native/handler'


    const BLOCK_JIYOUJIA = 'block_ji_you_jia';

    export default {
        components: {SplitBar},
        name: 'block-ji-you-jia',
        beforeCreate() {
            loadingState.loading(BLOCK_JIYOUJIA)
        },
        data() {
            return {
                /*
                 * ui对应数据，用于渲染
                 */
                block: {},

                /*
                 * 临时数据，包含很多组
                 * 每个组进过简单处理即为block
                 */
                zippedData: [],
                /*
                 * 当前已拉取的数据的总长度
                 */
                zippedLength: 0,
                /*
                 * 当前显示在界面上的是第几组数据
                 *
                 * 该数据的初始数据必须不同于 zippedLength
                 * 原因是这两个数据相等时，数据加载器会禁用掉缓存
                 */
                zippedIndex: undefined,

                /*
                 * 用于api请求的分页
                 */
                page: 0,
                /*
                 * 分页总页数
                 */
                pageLength: undefined,
            }
        },
        created() {
            this.render();
            this.registerRefreshEvent();
        },
        methods: {
            /**
             * 注册刷新事件
             */
            registerRefreshEvent() {
                // 注册刷新事件
                this.$store.commit(ON_HOME_REFRESHING, (callWhenFinished) => {
                    log.info(`[${BLOCK_JIYOUJIA}] rush_jiyoujia 刷新中`);
                    this.refresh(callWhenFinished);
                })
            },
            /**
             * 刷新
             */
            refresh(callWhenFinished) {

                // 服务器返回的数据还没用完
                if (++this.zippedIndex < this.zippedLength) {
                    log.info(`[${BLOCK_JIYOUJIA}] 采用了未用完的服务器数据`);
                    this.__handler(callWhenFinished);
                    return;
                }

                // 不是最后一页数据（服务器数据）
                if (++this.page < this.pageLength) {
                    log.info(`[${BLOCK_JIYOUJIA}] 服务器返回的数据都已用完，再次拉取数据中`);
                    this.render(callWhenFinished);
                    return;
                }

                // 最后一页数据，ui上的显示数据重复之前的数据即可
                log.info('服务器资源不足，重置为第一组数据');
                this.zippedIndex = 0;
                this.__handler();
                callWhenFinished();

            },
            /**
             * 加载数据
             */
            loader() {
                return new Promise(resolve => {
                    loader.A({
                        logKey: `[${BLOCK_JIYOUJIA}]`,
                        version: this.zippedLength === this.zippedIndex ? 'no-cache' : '*',
                        cacheName: BLOCK_JIYOUJIA,
                        storagePromise: dao.get__ji_you_jia_groups(),
                        serverPromiseFunc: () => Vue.axios.get(api.url.getJiyoujia(this.page, 2)),
                        renderCallback: (data, type) => resolve({data, type})
                    })
                });
            },
            /**
             * 自定义的处理器
             */
            __handler(callWhenFinished) {
                this.handler(this.zippedData, 'storage', callWhenFinished);
            },

            /**
             * 创建处理器
             */
            __getBlockHandler(callWhenFinished) {
                /**
                 * 此时的data已经处理完毕
                 * 直接与视图绑定
                 *
                 * @param uiData
                 */
                const uiDataHandler = (uiData) => {
                    callWhenFinished && callWhenFinished();
                    this.block = uiData;
                    loadingState.ok(BLOCK_JIYOUJIA)
                };

                const handlers = {
                    error: {
                        handler: _.curryRight(errorHandler.default)(`[${BLOCK_JIYOUJIA}] 网络链接错误`)
                    },

                    server: {
                        handlerSnippet: {
                            originalData: this.zippedData
                        },
                        after: {daoHandler: (data) => dao.set__ji_you_jia_groups(data).then()},
                    },

                    storage: {
                        before: {
                            daoDeleteHandler: (data) => dao.delete__ji_you_jia_groups(data).then(),
                            daoSetHandler: (data) => dao.set__ji_you_jia_groups(data).then(),
                        },
                        handlerSnippet: {
                            zippedIndex: this.zippedIndex || (this.zippedIndex = 0),
                            currentData: {
                                head: this.block.head,
                                content: this.block.content && _.flatten(this.block.content),
                            },
                            i_need_the_zipped_data: d => (this.zippedData = d, this.calcZippedlength(d))
                        },
                    },

                    timer: 'storage',

                    cache: {
                        handlerSnippet: uiDataHandler
                    }
                };

                /*
                 * 将处理器置入处理方法中（第一阶）
                 */
                return blockHandler(handlers);

            },

            handler(data, type, callWhenFinished) {

                /*
                 * 使用处理器处理数据
                 */
                DataContainer.of(data)
                    .map(this.__getBlockHandler(callWhenFinished)(type));

            },

            /**
             * 处理与渲染数据
             */
            async render(callWhenFinished) {

                /*
                 * 拉取数据
                 */
                let event = await this.loader();
                log.info(`[${BLOCK_JIYOUJIA}] 使用了 ${event.type} 类型的数据`);

                /*
                 * 计算服务器数据总页数
                 */
                this.calcPageLength(event.data);

                this.handler(event.data, event.type, callWhenFinished)

            },
            calcPageLength(serverData) {
                this.pageLength = Math.max(serverData.head.totalPages, serverData.content.totalPages);
            },
            calcZippedlength(zippedData) {
                this.zippedLength = Math.min(zippedData.head.length, zippedData.content.length)
            }
        }
    }
</script>

<style></style>