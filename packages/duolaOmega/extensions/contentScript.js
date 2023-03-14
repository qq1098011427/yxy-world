import JSConfetti from 'js-confetti'

chrome.runtime.onMessage.addListener(async (messages, sender, sendResponse) => {
    const {command, message} = messages
    const jsConfetti = new JSConfetti()

    if (command === 'updateDynamicRules') {
        const {rules} = message
        // 提示转发成功
        // 控制台打印内容与dom特效
        jsConfetti.addConfetti({
            emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
            emojiSize: 20,
            confettiNumber: 500
        })
        setTimeout(jsConfetti.clearCanvas, 1000)
        console.log('%c duolaOmega:转发成功 ', 'color: #fff; background: #27c777; padding: 5px; border-radius: 5px;')
        rules.forEach(({ source, target }) => {
            console.log(`%c${source} %c-> %c${target}`, 'color: #f49330', 'color: #fac022', 'color: #f49330')
        });
        console.log('%c ==================== 已关闭跨域 ====================', 'color: #f67058')
    }
    if (command === 'clearDynamicRules') {
        // 控制台打印内容
        console.log('%c duolaOmega:关闭转发 ', 'color: #fff; background: #f67058; padding: 5px; border-radius: 5px;')
    }
})