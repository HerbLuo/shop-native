<!--
    
    @author herbluo
    change logs:
    2017/4/17 herbluo created
-->
<!--suppress JSUnresolvedVariable -->
<template>
    <div class="entrance-bar">
        <div class="entrance-line"
             v-if="entrances"
             v-for="entrance_aline in entrances"
        >
            <div class="entrance" v-for="entrance in entrance_aline" :key="entrance.id">
                <image class="image" :src="entrance.img"></image>
                <text class="text">{{entrance.name}}</text>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .entrance-bar {
        margin-left: 15px;
        margin-right: 15px;
        width: 720px;
        height: 340px;
        justify-content: center;
    }

    .entrance-line {
        flex-direction: row;
        margin-bottom: 10px;
        margin-top: 10px;
    }

    .entrance {
        flex: 1;
        align-items: center;
    }

    .image {
        width: 88px;
        height: 88px;
    }

    .text {
        margin-top: 5px;
        font-size: 24px;
    }
</style>

<script>
    import loadingState from '../../utils/LoadingState'
    import errorStack from '../../utils/errorStack'
    import api from '../../api'
    import log from '../../utils/log'
    import cache from '../../utils/cache'
    import dao from '../../dao'
    import {ACTION_UPDATE_APP_DATA_IN_STORAGE} from '../../store/mutation-action'
    import shopNativeDataLoader from '../../utils/shop-native/loader'


    //noinspection ES6ModulesDependencies
    const storage = weex.requireModule('storage');

    const ENTRANCE_BAR = 'entrance-bar';

    export default {
        name: 'entrance-bar',
        beforeCreate() {
            loadingState.loading(ENTRANCE_BAR)
        },
        data() {
            return {
                entrances: null,
                isEntranceDataFromServer: false
            }
        },
        created() {
            if (this.$store.state.appDataInServer.appEntranceVersion) {
                log.warning(`[${ENTRANCE_BAR}]！！！竟然连服务端数据都获取完毕了，活久见`);
                this.render();
            }
            else if (this.$store.state.appDataInStorage.appEntranceVersion) {
                log.info(`[${ENTRANCE_BAR}] 组件创建的时候，数据已经初始化完毕`);
                this.render();
            }
        },
        watch: {
            '$store.state.appDataInStorage.appEntranceVersion': function () {
                this.isEntranceDataFromServer || this.render();
            },
            '$store.state.appDataInServer.appEntranceVersion': 'render',
        },
        methods: {
            /**
             * get data
             * 获取entrance对象
             */
            loadEntranceBar(cb) {

                // 最终使用的 appEntrance版本
                let appEntranceVersion = this.$store.state.appDataInServer.appEntranceVersion
                    || this.$store.state.appDataInStorage.appEntranceVersion;


                // 依次从 cache, storage, server获取entrance
                shopNativeDataLoader.A({
                    logKey: `[${ENTRANCE_BAR}]`,
                    version: appEntranceVersion,
                    cacheName: ENTRANCE_BAR,
                    storagePromise: dao.get__entrance_bar(),
                    serverPromiseFunc: () => Vue.axios.get(api.url.getEntrance()),
                    renderCallback(data, type) {
                        //noinspection FallThroughInSwitchStatementJS
                        switch (type) {
                            case 'error':
                                this.catchAnError(data);
                                break;
                            case 'server':
                                this.isEntranceDataFromServer = true;
                                cache.set(ENTRANCE_BAR, entrancesData);
                                this.saveEntranceBar(data);
                            case 'cache':
                            case 'storage':
                            case 'timer':
                            default:
                                cb(data);
                                break;
                        }
                    }
                });
            },
            /**
             * 保存entranceBar，
             * 更新appEntranceVersion
             */
            saveEntranceBar(entranceBar) {
                dao.set__entrance_bar(JSON.stringify(entranceBar)).then(e => {
                    if (e.result === 'success') {
                        this.$store.dispatch(ACTION_UPDATE_APP_DATA_IN_STORAGE, {appEntranceVersion});
                    }
                });
            },
            /**
             * get data and render
             */
            render() {
                log.info('[entrance-bar] render');

                this.loadEntranceBar((entrancesBar) => {
                    let entrances = entrancesBar.entitys;

                    // 异常情况检测 entrance 非数组
                    if (!entrances instanceof Array) {
                        loadingState.bad(ENTRANCE_BAR);
                        return;
                    }

                    // 对entrances按照.index重新排列 TODO
                    this.entrances = [entrances.slice(0, 5), entrances.slice(5, 10)];

                    loadingState.ok(ENTRANCE_BAR);
                });
            },
            catchAnError(e) {
                log.error(`[${ENTRANCE_BAR}] 网络无法链接`);
                errorStack.push(e);
                throw new Error(e);
            }
        }
    }
</script>

<style></style>