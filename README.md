# shop-native

>
> 基于 weex(vuejs)的shop-native  
> 同时使用了vuex, vue-router, axios(少许修改)。  
> 修改了[部分代码](#repair_async)，使得async语法糖在安卓平台下也顺利运行。
>
> 特性：
> 1. 动态加载初始化代码，在app首次打开时，初始化持久层数据。
> 2. 启用了内存缓存和闪存缓存，当数据过旧时，采用服务端数据。
> 3. app创建时，自动启用loading状态，当所有组件加载完毕后，转换状态为loaded，通知 java，oc 端。

## file structure

* `src/*`: all source code
* `app.js`: entrance of the Weex page
* `build/*`: some build scripts
* `dist/*`: where places generated code
* `assets/*`: some assets for Web preview
* `index.html`: a page with qrcode of Weex js bundle
* `shop.html`: Web render
* `.babelrc`: babel config (preset-2015, async, object-rest-spread)
* `.eslintrc`: not used

#### src structure
* `a_sub_apps` sub app（动态拉取），当前只包括app初始化代码片段
* `api` 包含：服务端api，组件地址，图片大小调整api
* `components` vue组件，@see `views`
* `dao` 数据持久化和读取层
* `eventbus` 包含vuex无法处理和不方便处理的事件：全局事件和简单事件
* `store` vuex store
* `utils` utils
* `views` 路由级界面

## npm scripts

```bash
# build the two js bundles and watch file changes
npm run dev

# start a Web server at 192.16.137.1:89
npm run serve

# start weex-devtool for debugging with native
npm run debug
```

## run it

1. npm install

2. 运行[服务端代码](https://github.com/HerbLuo/shop-api)或者跳过此步

3. 修改 `/src/api/index.js` 下的服务端地址 *(default.)url.base* 为步骤2中的ip
<br/> 或 `http://www.cloudself.cn/shop/`

4. 修改 `package.json` 下的 serve script，将ip修改成 本机可用的ip，port 可保持89不变
<br/> 修改 `/src/api/index.js` 下的app地址 *(default.)app.appBase* 为上述的ip + port

5. <span name="repair_async">打开</span> `\node_modules\regenerator-runtime\runtime.js`, 进行如下修改
```
// 删除如下代码片段 
var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
GeneratorFunctionPrototype.constructor = GeneratorFunction;
```   
```
// 同样的位置添加如下代码
var o = Object.create(IteratorPrototype);
var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = {
    constructor: GeneratorFunctionPrototype,
    __proto__: GeneratorFunctionPrototype.prototype.__proto__
}
GeneratorFunction.prototype = Gp.constructor;
GeneratorFunctionPrototype.constructor = GeneratorFunction;
```
>注释：代码使用了es2017 async API, babel 的转换器中有部分代码不与weex兼容
这是由于安卓平台下weex默认冻结了Object，导致object的constructor属性无法被设置，
如只使用iOS平台，可不必进行修改

6. npm run serve, npm run debug

7. open `http://ip:port/index.html` to show the QR code,
<br/>open `http://ip:port/shop.html` to show the Web render

## other
[安卓端](https://github.com/HerbLuo/shop-android)

[IOS请使用playground](https://github.com/apache/incubator-weex/tree/0.13-dev/ios)

# License:
本项目的所有 __代码__ 均可自由使用，修改或者用来干其它任何事情，但需保留署名

本项目引用的所有 __图片资源__ 均非本人所有，禁止用于任何商业活动

使用其他资源，请联系 i@closx.com
