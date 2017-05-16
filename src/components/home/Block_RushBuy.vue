<!--
    该模块的实现方式已废弃，
    新的实现方式请参考./Block_JiYouJia.vue的实现
    @author herbluo
    change logs:
    2017/4/19 herbluo created
-->
<!--suppress CommaExpressionJS -->
<!--suppress JSUnresolvedVariable -->
<template>
    <div class="rush-buy">
        <div v-if="rushBuyInUi" v-for="(row, indexRow) in rushBuyInUi">
            <div class="row">
                <div class="item" v-for="(item, index) in row">
                    <image
                            class="image"
                            :src="item.img"
                            :class="item.cssClass"
                            :placeholder="item.placeholder"
                    ></image>
                    <div class="vertical-line" v-if="index === 0"></div>
                </div>
            </div>
            <div v-if="indexRow === 0" class="line"></div>
        </div>
        <timer v-if="rushBuyInUi" class="par-timer" :startTimestamp="rushBuyInUi[0][0].startTimestamp"></timer>
    </div>
</template>

<style scoped>
    .rush-buy {
        width: 750px;
        height: 450px;
        position: relative;
    }

    .row, .item {
        flex-direction: row;
    }

    /*noinspection CssUnusedSymbol*/
    .image-left {
        width: 374px;
        height: 224px;
    }

    /*noinspection CssUnusedSymbol*/
    .image-right {
        width: 375px;
        height: 224px;
    }

    .line, .vertical-line {
        background-color: #e8e8e8;
    }

    .line {
        width: 750px;
        height: 1px;
    }

    .vertical-line {
        width: 1px;
        height: 224px;
    }

    .par-timer {
        position: absolute;
        top: 60px;
        left: 23px;
    }
</style>

<script>

    import Timer from "./rushbuy/Timer.vue";
    import {errorHander} from "../../utils/errorStack";
    import {ON_HOME_REFRESHING} from '../../store/mutation-action'
    import log from '../../utils/log'
    import loadingState from '../../utils/LoadingState'
    import cache from '../../utils/cache'
    import arrayUtil from '../../utils/array-util'
    import shopNativeDataLoader from "../../utils/shop-native/shopNativeDataLoader";
    import dao from "../../dao/index";
    import api from "../../api/index";

    const BLOCK_RUSHBUY = 'block_rush_buy';

    export default {
        components: {Timer},
        name: 'block-rush-buy',
        beforeCreate() {
            loadingState.loading(BLOCK_RUSHBUY)
        },
        created() {
            // 注册刷新事件
            this.registerRefreshEvent();
            this.loader_handler_render();
        },
        data() {
            return {

                /*
                 * 最终的视图层modal
                 */
                rushBuyInUi: null,
                /*
                 * 组
                 * 由index属性分类而来 [{ID, Array}],
                 *
                 * 为何分组：
                 * 从服务器加载的数据不止一组，
                 * 渲染到UI上的只会是一组数据
                 */
                rushBuyGroups: [],
                /*
                 * 当前使用的是第几组
                 */
                currentDataGroupIndex: -1,
                /*
                 * 总组数
                 */
                totalDataGroup: -2,
            }
        },
        methods: {
            /**
             * 注册刷新事件
             */
            registerRefreshEvent() {
                // 注册刷新事件
                this.$store.commit(ON_HOME_REFRESHING, (callWhenFinished) => {
                    log.info(`[${BLOCK_RUSHBUY}] rush_buy 刷新中`);
                    this.refresh(callWhenFinished);
                })
            },
            refresh(whenFinished) {

                if (this.currentDataGroupIndex < this.totalDataGroup) {
                    this.currentDataGroupIndex++;
                    this.handler_render(this.rushBuyGroups, 'storage', whenFinished);
                } else {
                    this.loader_handler_render(whenFinished);
                }

            },
            /**
             * 加载 处理 渲染数据
             *
             * 服务端数据(持久化至闪存) -> rushBuyGroups(多组rushBuy数据) -> rushBuys(单组rushBuy数据) -> rushBuyInUi(用于渲染的数据)(内存缓存)
             *
             * 注意，该函数必须可作为刷新函数使用（不许使用缓存数据）
             * 但不建议执行作为刷新函数使用
             * 因为该函数可能包含大量的冗余代码
             */
            loader_handler_render(whenFinished) {
                const vm = this;

                log.info('[block_rush_buy] loading data');

                // 依次从 cache, storage, server获取entrance
                shopNativeDataLoader.A({
                    logKey: `[${BLOCK_RUSHBUY}]`,
                    version: this.currentDataGroupIndex === this.totalDataGroup ? 'no-cache' : '*',
                    cacheName: BLOCK_RUSHBUY,
                    storagePromise: dao.get__rush_buy_groups(),
                    serverPromiseFunc: () => Vue.axios.get(api.url.getRushbuy()),
                    renderCallback(data, type) {
                        vm.handler_render(data, type, whenFinished)
                    }
                });

            },
            /**
             * 处理 渲染数据
             * @param data 数据
             * @param type 数据类型
             * @param callWhenFinished
             */
            handler_render(data, type, callWhenFinished) {

                const vm = this;

                let dataFromServer, // 原始数据 服务端返回的数据
                    rushBuyGroups, // 按照index分组后的数据（服务端返回了多组数据）
                    rushBuys, // 单组数据
                    rushBuyInUi; //用于Ui绑定的数据

                //noinspection FallThroughInSwitchStatementJS
                switch (type) {
                    case 'error':
                        errorHander.default(data, `[${BLOCK_RUSHBUY}] 网络链接错误`);
                        break;

                    case 'server':
                        /*
                         * dataFromServer -> rushBuyGroups
                         * 并持久化至闪存
                         */

                        dataFromServer = data;

                        // 检查服务端返回的数据是否符合要求
                        if (!(dataFromServer instanceof Array) || dataFromServer.length < 1) {
                            log.error(`[${BLOCK_RUSHBUY}] rushBuyInServer不符合要求`);
                            loadingState.bad(BLOCK_RUSHBUY);
                            return;
                        }

                        // 为数据加入时间戳信息
                        data.forEach(rushbuy => {
                            rushbuy.timestamp = new Date().getTime();
                        });

                        // 分组 或者合并原有组且分组
                        rushBuyGroups = arrayUtil.groupBy_PropertyEqual(dataFromServer, 'index', this.rushBuyGroups);

                        // 保存rush_buy
                        dao.set__rush_buy_groups(JSON.stringify(rushBuyGroups)).then();

                        this.rushBuyGroups = rushBuyGroups;

                    case 'timer':
                    case 'storage':
                        /*
                         * rushBuyGroups -> rushBuys -> rushBuysInUi
                         */
                        rushBuyGroups = rushBuyGroups || data;

                        // 计算总组数
                        this.totalDataGroup = rushBuyGroups[0].group.length;

                        // 取出一个组
                        rushBuys =
                            arrayUtil._pickItemFromEachGroup(this.rushBuyGroups, ++ this.currentDataGroupIndex, 'ASC');

                        // 添加一些Ui显示相关的数据
                        rushBuyInUi = addSomeUiFeatures(rushBuys);

                        /*
                         * 缓存 rushBuyInUi
                         */
                        cache.set(BLOCK_RUSHBUY, rushBuyInUi);

                    case 'cache':

                        rushBuyInUi = rushBuyInUi || data;
                        this.render(rushBuyInUi);

                    default:
                        // 本组件的状态转换
                        callWhenFinished && callWhenFinished();
                        loadingState.ok(BLOCK_RUSHBUY);
                        break;
                }


                /**
                 * 处理rushBuy数据
                 * 转换成UI认可的格式（渲染数据）
                 */
                function addSomeUiFeatures(rushBuys) {
                    rushBuys[0].startTimestamp = new Date().getTime() + 1000001;
                    rushBuys[0].cssClass = rushBuys[2].cssClass = ['image-left'];
                    rushBuys[1].cssClass = rushBuys[3].cssClass = ['image-right'];

                    const rushBuyInUi = vm.rushBuyInUi;
                    rushBuyInUi && rushBuys.forEach((rushBuy, i) => {
                        rushBuy.placeholder = rushBuyInUi[(i/2)|0][i%2].img;
                    });

                    console.info(rushBuys);

                    // 为视图指定专用的数据格式
                    return [rushBuys.slice(0, 2), rushBuys.slice(2, 4)];
                }

            },
            /**
             * 渲染数据
             */
            render(data) {
                log.info('[block_rush_buy] render');
                this.rushBuyInUi = data;
            },

        },
    }
</script>

<style></style>