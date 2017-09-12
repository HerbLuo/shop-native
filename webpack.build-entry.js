/**
 *
 * any question or idea, email to i@closx.com
 * @author _啃Apple的猫
 * @see http://www.jianshu.com/p/497f1a9ff33f
 *
 * change logs:
 * 2017/8/22 herbluo created
 */
// build-entry.js
const path = require('path')
const fs = require('fs-extra')

const srcPath = path.resolve(__dirname, './src/views') // 每个.vue页面
const entryPath = path.resolve(__dirname, './entry/') // 存放入口文件的文件夹
const FILE_TYPE = '.vue'

const getEntryFileContent = path => {
  return `// 入口文件
import App from '${path}${FILE_TYPE}'
import store from '../src/store'
import '../src/app-common'

/* eslint-disable no-new */
new Vue({
  el: '#root',
  store,
  render: h => h(App)
})

`
}
// 导出方法
module.exports = () => {
  // 写入每个文件的入口文件
  fs.readdirSync(srcPath).forEach(file => {
    const fullpath = path.resolve(srcPath, file)
    const extname = path.extname(fullpath)
    const name = path.basename(file, extname)
    if (fs.statSync(fullpath).isFile() && extname === FILE_TYPE) {
      //写入vue渲染实例
      fs.outputFileSync(path.resolve(entryPath, name + '.js'), getEntryFileContent('../src/views/' + name))
    }
  })
  const entry = {}
  // 放入多个entry
  fs.readdirSync(entryPath).forEach(file => {
    const name = path.basename(file, path.extname(path.resolve(entryPath, file)))
    entry[name] = path.resolve(entryPath, name + '.js')
  })
  return entry
}

// 作者：_啃Apple的猫
// 链接：http://www.jianshu.com/p/497f1a9ff33f
//     來源：简书
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。