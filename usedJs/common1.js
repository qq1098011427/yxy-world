// promise 全局捕获
window.addEventListener('unhandledrejection', function (event) {
    console.log('event', event);
    console.log('message', event.message);
    event.preventDefault()
});