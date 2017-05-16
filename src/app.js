'use strict';
/*
 * 引入 axios
 */
const axios = require('./utils/vendors/axios/lib/axios');
Vue.axios = axios;
Vue.prototype.$axios = axios;

/*
 * http请求全局拦截器
 * 处理异常返回结果
 */
import ResponseHandler from './utils/bridge/response-handler'
// noinspection JSUnresolvedVariable
axios.interceptors.response.use(ResponseHandler.success, ResponseHandler.error);

/*
 * 引入 VueRouter
 */
const VueRouter = require('vue-router');
Vue.use(VueRouter);

import routes from './routes';
const router = new VueRouter(routes);

/*
 * 引入Vuex
 */
import Vuex from 'vuex'
const modal = weex.requireModule('modal');
//noinspection ES6ModulesDependencies
if (weex.config.platform !== 'Web' && weex.config.env.platform !== 'Web') {
    Vue.use(Vuex);
} else {
    modal.toast({
        message: 'plantform: Web',
        duration: 1,
    })
}

/*
 * App主界面
 */
const App = require('./App.vue');
App.el = '#root';
App.router = router;
export default new Vue(App);
