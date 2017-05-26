import {Axios} from "../vendors/axios/index";
/**
 * @author Ghosted
 * @date 2017/3/30.
 */

declare namespace dewarn {

    interface console {
        info(str: any)
        log(str: any)
        error(str: any)
    }

    axios: Axios

    /**
     * 主要用于模拟服务端拉取的数据
     */
    interface body {
        access_token: string
    }
    interface response {
        body: body
    }
    interface item {
        id: number,
        enabled: boolean,
        modifyTime: number,
        version: string,
        name: string,
        price: number,
        description: string,
        picLinksJson: string,
        picLinksJson: Array,
        itemSellingInfo: {
            itemId: number,
            quantity: number,
            sales: number,
            commentNum: number,
            score: number,
            inOrdering: number
        },
        detailDivId: number,
        hop: {
            id: number,
            enabled: boolean,
            name: string,
            sellerId: number
        }

    }

    /**
     * weex 实例变量
     */
    interface weex {
        config: {
            platform: string
            env: {
                platform: string
            }
        }
    }

    /**
     * Weex module
     */
    interface module {
        loadSuccess(): void
        onStop(call: Function): void
    }

    /**
     *
     */
    interface app {
        /*
         * 数据更新时间
         * 时间戳
         */
        updateTimestamp: number,
        appEntranceVersion: number,

    }

}

declare const console: dewarn.console;
declare const response: dewarn.response;
declare const weex: dewarn.weex;
declare const axios: dewarn.axios;
declare const module: dewarn.module;
declare const item: dewarn.item;
