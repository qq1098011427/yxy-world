import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.less'

// const guideParams = [
//     {
//         resources: [guidePageImg1, guidePageImg11],
//         wh: ['210 100', '390 150'],
//         position: ['210 410', '198 0']
//     },
//     {
//         resources: [guidePageImg2, guidePageImg22],
//         wh: ['170 105', '99% 126'],
//         position: ['210 420', '60 10']
//     },
//     {
//         resources: [guidePageImg3, guidePageImg33],
//         wh: ['175 98', '135 100%'],
//         position: ['50 0', '50 -150']
//     },
//     {
//         resources: [guidePageImg4, guidePageImg44],
//         wh: ['175 104', '70% 365'],
//         position: ['385 180', '370 370']
//     }
// ]

export const useGuidePage = guideParams => {
  const [selectIndex, setSelectIndex] = useState(-1)
  let div = document.createElement('div')
  document.body.appendChild(div)
  const openGuide = () => {
    setSelectIndex(0)
  }
  const GuidePage = () => {
    return [
      <div className="guide-cover"></div>,
      guideParams.map((item, index) => {
        return item.resources.map((resource, rindex) => {
          const _top = item.position[rindex].split(' ')[0]
          const _left = item.position[rindex].split(' ')[1]
          const _width = item.wh[rindex].split(' ')[0]
          const _height = item.wh[rindex].split(' ')[1]
          return selectIndex === index ? (
            <div className="guide-img" onClick={() => setSelectIndex(selectIndex + 1)}>
              <img
                src={resource}
                style={{
                  position: 'absolute',
                  zIndex: 1001,
                  width: `${_width.indexOf('%') > -1 ? _width : _width + 'px'}`,
                  height: `${_height.indexOf('%') > -1 ? _height : _height + 'px'}`,
                  top: `${_top}px`,
                  left: `${_left}px`
                }}
              />
            </div>
          ) : null
        })
      })
    ]
  }

  useEffect(() => {
    if (window.localStorage.getItem('guideFlag')) return
    ReactDOM.render(<GuidePage />, div)
    const unmount = () => {
      const unmountResult = ReactDOM.unmountComponentAtNode(div)
      if (unmountResult) {
        document.body.removeChild(div)
      }
    }
    if (selectIndex > guideParams.length - 1) {
      unmount()
      window.localStorage.setItem('guideFlag', true)
    }
    return () => {
      unmount()
    }
  }, [selectIndex])

  return { openGuide }
}
