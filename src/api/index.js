/**
 * 保存 图片基址，restful请求地址
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/3/30
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/3/30 herbluo created
 */

export default {

    src: {

        /**
         * 获取图片地址
         * @param main 基址
         *      例如: //www.cloudself.cn/img/img1.jpg
         * @param size
         * @param type lfit：等比缩放，限制在设定在指定w与h的矩形内的最大图片。
         *             mfit：等比缩放，延伸出指定w与h的矩形框外的最小图片。
         *             fill：固定宽高，将延伸出指定w与h的矩形框外的最小图片进行居中裁剪。
         *             pad：固定宽高，缩略填充
         *             fixed：固定宽高，强制缩略
         * @return {string}
         */
        img(main, size, type) {
            main = this.nonResizeImg(main);

            let sizeParam;
            if (size === 'original') {
                return main;
            }

            if (size === 'big') {
                sizeParam = 'w800h800'
            } else if (size === 'small') {
                sizeParam = 'w50h50'
            } else if (size && (sizeParam = size.match(/^w(\d+)h(\d+)$/))) {
                if (type) {
                    return `${main}?x-oss-process=image/resize,${type},w_${sizeParam[1]},h_${sizeParam[2]}`;
                }
                return `${main}?x-oss-process=image/resize,m_fill,w_${sizeParam[1]},h_${sizeParam[2]}`
            } else {
                sizeParam = 'w250h250'
            }
            return `${main}?x-oss-process=style/${sizeParam}`
        },

        /**
         * 获取图片的原图
         * @param main
         * @return {string}
         */
        nonResizeImg(main) {
            return main.indexOf('//') === 0
                ? `${window.location.protocol === 'file:' ? 'http:' : ''}${main}`
                : main;
        },

        /**
         * 引用一个无法访问的图片地址（非图片地址）
         * @return {string}
         */
        bad() {
            return '//localhost';
        },

        /**
         * 用户默认头像
         * @return {*|string}
         */
        defaultUserAvatar() {
            return this.nonResizeImg(
                '//closx-shop.oss-cn-qingdao.aliyuncs.com/images/user/TB1yeWeIFXXXXX5XFXXuAZJYXXX.png'
            );
        }
    },

    app: {
        appBase: `http://192.168.137.1:89/dist`,
        plantform: weex.config.platform === 'Web' ? 'web' : 'weex',
        getInitSnippet() {
            return `${this.appBase}/sub_app_init_snippet.${this.plantform}.js`
        }
    },

    /**
     * 网址
     */
    url: {

        // TODO 服务端地址
        base: 'http://192.168.137.1:8080',
        
        // ---------------------APP------------------------
        /**
         * 获取App的信息，包含各组件的版本等信息
         * @return {string}
         */
        getApp() {
            return `${this.base}/app/native/info/`
        },

        /**
         * App入口
         */
        getEntrance() {
            return `${this.base}/app/native/entrance/`
        },

        /**
         * 搜索热词
         */
        getHotKey() {
            return `${this.base}/app/hotkey/`
        },

        /**
         * 轮播图
         * @param username
         * @param token
         */
        getSlider(username, token) {
            return `${this.base}/app/slider/optionalUser/${username}/size/8/${token ? `?access_token=${token}` : ''}`
        },

        /**
         * hotBar 内容
         */
        getHotbar() {
            return `${this.base}/app/native/hotbar/`
        },

        /**
         * rushBuy 抢购
         */
        getRushbuy() {
            return `${this.base}/app/native/rushbuy/`
        },

        /**
         * 极有家
         */
        getJiyoujia(page, apagesize) {
            return `${this.base}/app/native/jiyoujia/page/${page}/apagesize/${apagesize}/`
        },

        // ----------------------USER-----------------------
        /**
         * 用户认证
         * @param username
         * @param password
         */
        getToken(username, password) {
            return `${this.base}/oauth/token?grant_type=password&client_id=any&client_secret=s_any&username=${username}&password=${password}&scope=read`
        },

        /**
         * 刷新token
         * @param refresh_token
         */
        refreshToken(refresh_token) {

            return `${this.base}/oauth/token?grant_type=refresh_token&client_id=any&client_secret=s_any&refresh_token=${refresh_token}`
        },

        /**
         * 得到用户基本信息
         * @param username
         * @param token
         */
        getUserDetail(username, token) {
            return `${this.base}/user/${username}/?access_token=${token}`
        },

        // ---------------------------商品-----------------------
        /**
         * 查找商品
         * @param key
         * @param order
         * @param page
         * @param apagesize
         */
        findItem(key, order, page, apagesize) {
            return `${this.base}/item/key/${key}/order/${order}/page/${page}/apagesize/${apagesize}/`
        },

        /**
         * 根据商品id获取商品
         * @param itemId
         * @return {string}
         */
        getItemById(itemId) {
            return `${this.base}/item/?itemIds=${itemId}`
        },

        /**
         * 根据商品id获取商品
         * @param itemIds
         */
        getItemsByIds(itemIds) {
            let url = `${this.base}/item/?`;
            itemIds.forEach(itemId => {
                url += `itemIds=${itemId}&`
            });
            return url.substring(0, url.length - 1);
        },

        /**
         * 得到商品详细描述信息
         * @param itemId
         * @return {string}
         */
        getItemDetailDescribe(itemId) {
            return `${this.base}/item/${itemId}/detail/describe/json/`
        },

        /**
         * 得到商品详情
         * @param itemId
         * @return {string}
         */
        getItemDetail(itemId) {
            return `${this.base}/item/${itemId}/detail/div/`
        },

        /**
         * 得到商品评论
         * @param itemId
         * @param page
         * @param pageSize
         */
        getItemComment(itemId, page, pageSize) {
            return `${this.base}/item/${itemId}/comments/page/${page}/apagesize/${pageSize}/`
        },
        // --------------------------店铺-------------------------
        /**
         * 得到店铺的详细信息
         * @param shopId
         * @return {string}
         */
        getShopDetail(shopId) {
            return `${this.base}/shop/detail/${shopId}/`
        },

        /**
         * 得到店铺的顶部栏
         * @param shopId
         */
        getShopTopDiv(shopId) {
            return `${this.base}/shop/detail/topbar/${shopId}/`
        },

        /**
         * 得到店铺的侧边栏
         * @param shopId
         * @return {string}
         */
        getShopSideDiv(shopId) {
            return `${this.base}/shop/detail/sidebar/${shopId}`
        },
        // --------------------------订单相关-------------------------
        /**
         * 得到用户的收货地址
         * @param username
         * @param token
         */
        getAddress(username, token) {
            return `${this.base}/address/user/${username}/?access_token=${token}`
        },

        /**
         * 创建订单
         * @param username
         * @param token
         */
        createOrder(username, token) {
            return `${this.base}/order/user/${username}/?access_token=${token}`
        },

        /**
         * 支付
         * @param orderId
         * @param username
         * @param token
         */
        createPay(orderId, username, token) {
            return `${this.base}/order/${orderId}/user/${username}/payment/?access_token=${token}`
        },

        /**
         * 得到购物车
         * @param username
         * @param token
         */
        getCar(username, token) {
            return `${this.base}/car/user/${username}/?access_token=${token}`
        },

        /**
         * 添加商品到购物车
         * @param username
         * @param token
         * @return {string}
         */
        add2Car(username, token) {
            return `${this.base}/car/user/${username}/?access_token=${token}`
        },

        /**
         * 从购物车删除商品
         * @param username
         * @param token
         * @return {string}
         */
        deleteItem4Car(username, token) {
            return `${this.base}/car/user/${username}/?access_token=${token}`
        },

    }
}