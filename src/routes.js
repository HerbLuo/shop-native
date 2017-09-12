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
import VueRouter from 'vue-router'

const AppInitWeb = require('./views/AppInitWeb.vue')

const HomeHome = require('./views/HomeHome.vue')
const HomeTalk = require('./views/HomeTalk.vue')
const HomeQA = require('./views/HomeQA.vue')
const HomeCar = require('./views/HomeCar.vue')
const HomeUser = require('./views/HomeUser.vue')

const Item = require('./views/Item.vue')

const UserLogin = require('./views/UserLogin.vue')

const Order = require('./views/Order.vue')

const AddressSelector = require('./views/AddressSelector.vue')
const AddressManagement = require('./views/AddressManagement.vue')
const AddressUpdater = require('./views/AddressUpdater.vue')

const routes = [{
  path: '/appinitweb/',
  name: 'AppInitWeb',
  component: AppInitWeb
}, {
  path: '/home/home/',
  name: 'HomeHome',
  component: HomeHome
}, {
  path: '/home/talk/',
  name: 'HomeTalk',
  component: HomeTalk
}, {
  path: '/home/qa/',
  name: 'HomeQA',
  component: HomeQA
}, {
  path: '/home/car/',
  name: 'HomeCar',
  component: HomeCar
}, {
  path: '/home/user/',
  name: 'HomeUser',
  component: HomeUser
}, {
  path: '/item/detail/',
  name: 'Item',
  component: Item
}, {
  path: '/user/login/',
  name: 'UserLogin',
  component: UserLogin
}, {
  path: '/order/',
  name: 'Order',
  component: Order
}, {
  path: '/address/selector/',
  name: 'AddressSelector',
  component: AddressSelector
}, {
  path: '/address/management/',
  name: 'AddressManagement',
  component: AddressManagement
}, {
  path: '/address/updater/',
  name: 'AddressUpdater',
  component: AddressUpdater
}]

Vue.use(VueRouter)
const router = new VueRouter({routes})

export default router
