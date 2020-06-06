// 全局帮助类库
// 纯函数
function sin() {
    sin._version = 0.1
    // 节流
    sin.throttle = function(fn, wait) {
        let timer
        return function (...args) {
            if(!timer) {
                timer = setTimeout(() => timer = null, wait)
                return fn.apply(this, args)
            }
        }
    }
}