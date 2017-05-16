/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/4/26
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/4/26 herbluo created
 */
;

//noinspection ES6ModulesDependencies
const storage = weex.requireModule('storage');
const modal = weex.requireModule('modal');

import {weexEvent} from '../../eventbus'

import dao from '../../dao'

const app = {
    updateTimestamp: new Date().getTime() - (1000 * 60 * 5),
    appEntranceVersion: 'high-v1'
};

const entranceBar = {
    version: 'high-v1',
    entitys: [
        {
            "id": 1,
            "enabled": true,
            "index": 0,
            "name": "天猫",
            "img": "http://closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/26296458982d1396e14698be8f059ccef9db0917.png",
            "link": "wxshop://black"
        },
        {
            "id": 2,
            "enabled": true,
            "index": 1,
            "name": "聚划算",
            "img": "http://closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/d7b907b22952ac44f9e2d1029f8d364ac4560a52.png",
            "link": "wxshop://black"
        },
        {
            "id": 3,
            "enabled": true,
            "index": 2,
            "name": "天猫国际",
            "img": "http://closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/18224c9afd17fcf3e15bb03ea95c244e469a452d.png",
            "link": "wxshop://black"
        },
        {
            "id": 4,
            "enabled": true,
            "index": 3,
            "name": "外卖",
            "img": "http://closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/992bc9a571c9418bd7e6feb8f49c6e9ab4aa44da.png",
            "link": "wxshop://black"
        },
        {
            "id": 5,
            "enabled": true,
            "index": 4,
            "name": "天猫超市",
            "img": "http://closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/d0cb8b15a7fbc2ed7e1dd58a3fc5b0ae4cf423a5.png",
            "link": "wxshop://black"
        },
        {
            "id": 6,
            "enabled": true,
            "index": 5,
            "name": "充值中心",
            "img": "http://closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/2fcb04d9c79bcf97d1d7e4d9ac1c15627b3f8c13.png",
            "link": "wxshop://black"
        },
        {
            "id": 7,
            "enabled": true,
            "index": 6,
            "name": "飞猪旅行",
            "img": "http://closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/d2bf542dc0a4c015e16d0f5426abff9d17973979.png",
            "link": "wxshop://black"
        },
        {
            "id": 8,
            "enabled": true,
            "index": 7,
            "name": "淘金币",
            "img": "http://closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/e9f60973ac470de8c2aebb77fc634abad9e49cb8.png",
            "link": "wxshop://black"
        },
        {
            "id": 9,
            "enabled": true,
            "index": 8,
            "name": "到家",
            "img": "http://closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/a9737f07a51d5fe46a198dcd167674c5d70564e7.png",
            "link": "wxshop://black"
        },
        {
            "id": 10,
            "enabled": true,
            "index": 9,
            "name": "更多",
            "img": "http://closx-shop.oss-cn-qingdao.aliyuncs.com/app/v0/55164ce1a4ca4db3ff00b729575162a56cd05c30.png",
            "link": "wxshop://black"
        }
    ],
};

(async function () {
    console.info('init snippet started');

    let events;
    try {
        events = await Promise.all([
            dao.set__app(JSON.stringify(app)),
            dao.set__entrance_bar(JSON.stringify(entranceBar)),
        ]);
    } catch (e) {
        modal.toast({
            message: '[INIT_SNIPPET] 严重错误，dao模块代码逻辑错误',
            duration: 2
        });
        throw e;
    }

    for (let i = 0; i < events.length; i++) {
        if (events[i].result !== 'success') {
            console.warn('data wrote failed');
            weexEvent.postMessage__app_init('fail');
            return;
        }
    }

    weexEvent.postMessage__app_init('success');

})();
