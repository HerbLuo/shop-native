<!--
    App
    此模块加载时，界面不会有任何显示
    在App的loading状态转换成loaded之后，
    App很快完成渲染，此时可以通知native端
 -->
<template>
    <div class="app">
        <router-view></router-view>
    </div>
</template>
<style scoped>
</style>
<script>

    /*
     * weex模块
     */
    //noinspection ES6ModulesDependencies
    const module = weex.requireModule('WXShpLifecycle');
    //noinspection ES6ModulesDependencies
    const storage = weex.requireModule('storage');
    //noinspection ES6ModulesDependencies
    const navigator = weex.requireModule('navigator');
    //noinspection ES6ModulesDependencies
    const modal = weex.requireModule('modal');

    /*
     * common 代码
     */
    import store from './store'
    import loadingState from './utils/LoadingState'
    import errorStack from './utils/errorStack'
    import api from './api'
    import log from './utils/log'
    import cache from './utils/cache'
    import dao from './dao'
    import promise_util from './utils/promise-util'
    import {weexEvent} from './eventbus'
    import {
        SET_APP_DATA_IN_SERVER,
        SET_APP_DATA_IN_STORAGE,
    } from './store/mutation-action'

    export default {
        name: 'app',
        store,
        /**
         * 调用初始化方法 init()
         *
         * 当第一次打开App时
         * 不急着调用初始化方法,
         *  1. 先拉取 init_snippet代码，（初始化模块，该模块主要功能是初始化持久层）,
         *  2. 注册 init_snippet执行成功后的回调事件
         *  3. 执行 init_snippet
         *  4. 等待 init_snippet回调，其中回调方法中包含 invoke init()的代码
         *
         */
        async created() {
            const vm = this;
            const event = await dao.get__app();

            /*
             * app首次加载
             * 获取 init 代码片段，并执行
             * 等待返回执行结果
             */
            if (event.result !== 'success' || 1 /** TODO DEBUG */) {
                log.info('[app] App 首次加载，使用init_snippet初始化中');

                if (weex.config.platform === 'Web' || weex.config.env.platform === 'Web') {
                    const script = document.createElement('script');
                    script.src = api.app.getInitSnippet();
                    document.getElementsByTagName('head').item(0).appendChild(script);
                    Promise.race([weexEvent.onmessage__app_init(), promise_util.rejectDelay(2000) ])
                        .then(success, fail);
                    return;
                }

                // 获取 init 代码片段
                const response = await Vue.axios.get(api.app.getInitSnippet());

                // 加载失败
                if (!response.data) {
                    log.error('[app] App 初始化代码无法加载');
                    throw new Error('init_snippet无法获取');
                }

                // 加载成功
                Promise.race([
                    weexEvent.onmessage__app_init(),
                    // 两秒后返回失败
                    promise_util.rejectDelay(2000)
                ])
                    .then(success, fail);

                // 初始化
                eval(response.data);

            } else {
                success();
            }

            // 初始化模块执行成功
            function success() {
                log.info('[app] App 初始化成功');
                vm.$router.push({name: 'homeHome'});
                vm.init();
            }

            // 初始化模块执行失败 TODO 可考虑检测网络连接情况，以及再次尝试初始化
            function fail() {
                log.error('[app] 初始化代码已执行，但存在未知错误');
                throw new Error('app init_snippet初始化失败');
            }
        },
        methods: {
            // app 初始化代码
            init() {
                this.loadAppData();
                this.register_OnComponentsLoaded();
                this.register_OnAppStop();
            },

            /**
             * 加载 appData
             * appData 包含app内各组件的版本信息
             *
             * appData 分为闪存数据和服务端数据
             * 本地api为 dao.get__app()
             * 远程api为 api.url.getApp()
             *
             * 服务端的数据 控制App的第二次渲染（刷新）
             * 闪存中的数据 控制App的第一次渲染（第一次渲染会延时相应的毫秒，当服务端的数据在该时间段内返回，跳过第一次渲染）
             *
             * @returns {Promise.<void>}
             */
            async loadAppData() {

                /*
                 * App数据
                 * 包括各模块的版本等信息
                 */
                let appData;

                // 闪存里获取app数据
                const appDataEvent = await dao.get__app();

                /*
                 * 决不允许appData无法读取的情况出现
                 * 这意味着持久化操作无法访问
                 * app必然由 init_snippet 写入
                 * 如写入失败，应由上层模块终止程序运行
                 */
                if (appDataEvent.result !== 'success' || !appDataEvent.data) {
                    log.error('[app] app 信息无法读取，必要时检查设备存储空间是否有剩余');
                    throw new Error('app data access denied, can not get app from storage API.')
                }

                // 解析数据
                appData = appDataEvent.data;
                appData = JSON.parse(appData);

                /*
                 * appData 解析失败
                 */
                if (typeof appData !== 'object') {
                    log.error('[app] app 信息无法解析，typeof app: ' + typeof appData);
                    throw new Error('app data resolve denied, the app data is' + appData);
                }

                /*
                 * appData数据 更新时间离现在有多少天（向上取整），10分钟以内为0
                 */
                let dataUpdateDayTime = new Date().getTime() - appData.updateTimestamp;
                dataUpdateDayTime = dataUpdateDayTime < 1000 * 60 * 10
                    ? 0
                    : ((dataUpdateDayTime / 1000 / 60 / 60 / 24) | 0) + 1;

                /*
                 * 数据更新时间小于10分钟
                 * 不做任何更新操作
                 */
                if (dataUpdateDayTime === 0) {
                    log.info('[app] last update time of app data less than 10 minutes');
                    this.$store.commit(SET_APP_DATA_IN_STORAGE, appData);
                    return;
                }

                /*
                 * 加载数据（appData）等待时间
                 */
                const delayTime = dataUpdateDayTime * 100; // 毫秒

                /*
                 * delayTime毫秒内 若服务端未返回结果，
                 * 使用storage里的内容做第一次渲染
                 */
                let timer;

                // 从服务端获取最新数据 appData
                Vue.axios.get(api.url.getApp()).then(({data}) => {
                    log.info('[app] app data from server got, refreshing data');
                    clearTimeout(timer);
                    this.$store.commit(SET_APP_DATA_IN_SERVER, data);
                }).catch(err => {
                    log.error('[app] app data 无法获取， 请检查网络链接');
                    errorStack.push(err);
                });

                /*
                 * delayTime 后，
                 * 使用闪存中的数据执行第一次数据绑定（第一次渲染）
                 */
                timer = setTimeout(() => {
                    log.info(`[app] ${delayTime} ms, resolving app data from storage`);
                    this.$store.commit(SET_APP_DATA_IN_STORAGE, appData)
                }, delayTime)
            },

            /**
             * 注册
             * App加载完毕（即渲染完毕，实质是数据（第一次）绑定完毕(包括子模块的数据)）
             * 后的回调事件（即通知 java native端： 可以切换Activity了（App加载中 -> App主界面））
             */
            register_OnComponentsLoaded() {
                // 所有子组件初始化完毕后 的回调
                // 通知java端初始化完毕
                loadingState.onLoaded(() => {
                    log.info('[app] loaded called');
                    module && module.loadSuccess && module.loadSuccess();
                });
            },
            /**
             * App stop 通知，
             * 该通知由java native端调用，通知js端App stop了
             * 该通知在java native端的实现不完善，可能出现漏通知的情况
             */
            register_OnAppStop() {
                // app退出时
                // 由java端调用
                module && module.onStop && module.onStop(() => {
                    log.error(errorStack.toString());
                })
            }
        },
    }
</script>