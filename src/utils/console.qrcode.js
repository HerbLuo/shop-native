/**
 *
 * any question or idea, email to i@closx.com
 * @author HerbLuo
 * @date 2017/8/27
 * @license Licensed under the MIT license.
 *
 * change logs:
 * 2017/8/27 herbluo created
 */
import QRCode from 'qrcode'

const canvasSupport = () => {
  return !document.createElement('testcanvas').getContext
}

const isPlatformSupport = (() => {
  try {
    return canvasSupport()
  } catch (e) {
    return false
  }
})()

if (isPlatformSupport) {
  const canvas = document.createElement('canvas')
  console.qrcode = (str) => {
    // noinspection JSUnresolvedFunction
    QRCode.toCanvas(canvas, str, (error) => {
      if (error) {
        console.error(error)
        return
      }
      const dataUrl = canvas.toDataURL()
      const width = (canvas.width / 1.8) | 0
      const height = (canvas.height / 1.8) | 0
      console.log('%c',
        `padding:${width}px ${height}px;
        line-height:${2 * height + 20}px;
        background:url(${dataUrl}) no-repeat`)
    })
  }
} else {
  console.error('浏览器不支持canvas')
}
