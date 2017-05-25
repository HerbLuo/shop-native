/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/4/12
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/4/12 herbluo created
 */
const Home = require('./views/Home.vue');
const HomeHome = require('./views/HomeHome.vue');
const HomeTalk = require('./views/HomeTalk.vue');
const HomeQA = require('./views/HomeQA.vue');
const HomeCar = require('./views/HomeCar.vue');
const HomeUser = require('./views/HomeUser.vue');

const Item = require('./views/Item.vue');

export default {
    routes: [{
        path: '/home/',
        name: 'home',
        component: Home,
        children: [{
            path: 'home',
            name: 'homeHome',
            component: HomeHome,
        }, {
            path: 'talk',
            name: 'homeTalk',
            component: HomeTalk,
        }, {
            path: 'qa/',
            name: 'homeQa',
            component: HomeQA,
        }, {
            path: 'car/',
            name: 'homeCar',
            component: HomeCar,
        }, {
            path: 'user/',
            name: 'homeUser',
            component: HomeUser,
        }]
    }, {
        path: '/item/',
        name: 'item',
        component: Item,
    }]
}