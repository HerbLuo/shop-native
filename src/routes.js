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
const Talk = require('./views/Talk.vue');
const QA = require('./views/QA.vue');
const Car = require('./views/Car.vue');
const User = require('./views/User.vue');

export default {
    routes: [{
        path: '/home/',
        name: 'home',
        component: Home,
    },{
        path: '/talk/',
        name: 'talk',
        component: Talk,
    },{
        path: '/qa/',
        name: 'qa',
        component: QA,
    },{
        path: '/car/',
        name: 'car',
        component: Car,
    },{
        path: '/user/',
        name: 'user',
        component: User,
    }]
}