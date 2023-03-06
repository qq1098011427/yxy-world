//
// const guideParams = {
//   resource: [[guidePageImg1, guidePageImg11], [guidePageImg2, guidePageImg22], [guidePageImg3, guidePageImg33], [guidePageImg4, guidePageImg44]],
//   wh: [["210 100", "390 150"], ["170 105", "99% 126"], ["175 98", "135 100%"], ["175 104", "70% 365"]],
//   position: [["210 410", "198 0"], ["210 420", "60 10"], ["50 0", "50 -150"], ["385 180", "370 370"]],
// };

export const useLeadPage = props => {
  const leadParams = props || {
    resource: [],
    wh: [],
    position: []
  }
  const openLead = () => {
    // 添加阴影遮盖层
    const lead = document.createElement('div')
    lead.style =
      'width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 1000; background: rgba(0, 0, 0, 0.5);'
    document.body.appendChild(lead)
    // 添加引导图
    const leadImg = document.createElement('div')
    leadImg.style = 'width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 1001;'
    lead.appendChild(leadImg)
    let index = 0
    while (index < leadParams.resource.length) {
      leadParams.resource[index].forEach((item, rindex) => {
        const _top = leadParams.position[index][rindex].split(' ')[0]
        const _left = leadParams.position[index][rindex].split(' ')[1]
        const _width = leadParams.wh[index][rindex].split(' ')[0]
        const _height = leadParams.wh[index][rindex].split(' ')[1]
        const img = document.createElement('img')
        img.className = `lead-img${index}`
        img.src = item
        img.style = `position: absolute;
        width: ${_width.indexOf('%') > -1 ? _width : _width + 'px'};
        height: ${_height.indexOf('%') > -1 ? _height : _height + 'px'};
        top: ${_top}px;
        left: ${_left}px;
        display: ${index === 0 ? 'block' : 'none'};
       `
        leadImg.appendChild(img)
      })
      index++
    }
    let pindex = 0
    lead.addEventListener('click', () => {
      if (pindex >= index - 1) document.body.removeChild(lead)
      else {
        Array.from(document.querySelectorAll(`.lead-img${pindex}`)).forEach(
          item => (item.style.display = 'none')
        )
        Array.from(document.querySelectorAll(`.lead-img${++pindex}`)).forEach(
          item => (item.style.display = 'block')
        )
      }
    })
  }
  return { openLead }
}
