import React, { useState } from 'react'

// createWaterMark({
//     content: `123123123`,
//     targetId: 'news-detail'
// })

const useWaterMark = () => {
  const [waterId, setWaterId] = useState('')

  const getStyle = props => {
    const {
      width = '300', // canvas元素宽
      height = '200', // canvas元素高
      font = '12px Microsoft Yahei', // 字体大小及样式
      fillStyle = '000', // 自定义水印的颜色
      content = '', // 水印内容
      globalAlpha = 0.1, // 设置图形和图像透明度的值
      rotate = 16, // 文字旋转角度
      zIndex = 1001, // 元素堆叠顺序
      margin = 0,
      type = 0
    } = props
    return `
     transform-origin:center center;
     ${type === 2 ? 'opacity: 0.01;' : ''}
      position:absolute;
      top:0px;
      left:0px;
      width:100%;
      height:100%;
      z-index:${zIndex};
      pointer-events:none;
      background-repeat:repeat;
      background-image:url("data:image/svg+xml,%3Csvg width='${
        width * 1 + margin
      }' fill='%23${fillStyle}' height='${
      height * 1 + margin
    }' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%' y='50%' font-size='${font}' fill-opacity='${globalAlpha}' text-anchor='middle' style='transform-origin: center center;transform:rotate(-${rotate}deg);' dominant-baseline='middle' %3E${content}%3C/text%3E%3C/svg%3E")`
  }

  const createWaterMark = props => {
    const targetId = props.targetId
    const targetDom = document.querySelector('#' + targetId)
    if (!targetId || !targetDom) {
      return null
    }
    const wId = `_wm-${Math.random().toString(36).slice(1)}`
    setWaterId(wId)
    const waterStyle = getStyle(props)
    const vmDom = document.createElement('div')
    vmDom.setAttribute('id', wId)
    vmDom.setAttribute('style', waterStyle)
    targetDom.appendChild(vmDom)
  }

  const delWaterMark = props => {
    const { targetId } = props
    const targetDom = document.querySelector('#' + targetId) || document.body
    const delDom = document.getElementById(waterId)
    delDom && targetDom.removeChild(delDom)
  }

  return { createWaterMark, delWaterMark }
}

export default useWaterMark
