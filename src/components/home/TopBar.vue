<!--
    
    @author herbluo
    change logs:
    2017/4/12 herbluo created
-->
<template>
    <!--<div>-->
    <div class="topbar">
        <div class="scanner" @click="scanner">
            <image class="scanner-img"
                   src="//closx-shop.oss-cn-qingdao.aliyuncs.com/app/v1/imgs/scanner.png"></image>
        </div>
    </div>
    <!--</div>-->
</template>

<style scoped>
    .topbar {
        background-image: linear-gradient(to right, #F80, #F50);
        width: 750px;
        height: 100px;
    }

    .scanner {
        width: 100px;
        height: 100px;
        justify-content: center;
        align-items: center;
    }

    .scanner-img {
        width: 80px;
        height: 80px;
    }

</style>

<script>

    import _ from 'lodash'
    import log from '../../utils/log'
    import global from '../../utils/global'
    import {parseUrl, urlParamGetter} from "../../utils/shop-native/wxshopProtocol";
    const qrview = weex.requireModule("WXQrCode");
    const modal = weex.requireModule('modal');

    export default {
        name: 'entrance-bar',
        created() {
        },
        methods: {
            debugGoto() {
//                this.routerGoto('item', {
//                    id: 22,
//                    version: '2.0'
//                })
                this.uriHandler('wxshop://router/item/?param={"id":22,"version":"2.0"}')
            },
            scanner() {
                if (!qrview || !qrview.scanner) {
                    this.debugGoto();
                    return;
                }
                qrview.scanner(({uri}) => {
                    modal.toast({message: uri, duration: 2});
                    this.uriHandler(uri)
                });
                modal.toast({
                    message: '识别中',
                    duration: 1
                });
            },
            uriHandler(uri) {
                if (typeof uri !== 'string' || uri.length > 120) {
                    log.error('不支持的uri');
                }
                let url = parseUrl(uri);
                _.forEach(
                    {
                        wxshop: () => {
                            _.forEach(
                                {
                                    router: () => {

                                        let name = url.pathname.split('/');
                                        if (name .length < 2) {
                                            log.error('无法解析的uri %s', uri);
                                            return;
                                        }
                                        name = name[1];

                                        let param = urlParamGetter('param', url.search);
                                        try {
                                            param = JSON.parse(param);
                                        } catch (e) {
                                            log.error('无法解析为JSON' + param);
                                            return;
                                        }

                                        this.routerGoto(
                                            name,
                                            param

                                        )
                                    }
                                },
                                (value, key) => url.host === key && value()
                            )
                        }
                    },
                    (value, key) => url.protocol.split(':')[0] === key && value()
                )
            },

            routerGoto(name, params, query) {
                this.$router.push({
                    name: name,
                    params,
                    query
                });
            },
        }
    }
</script>

<style></style>