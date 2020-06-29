// gulp 适合处理一些小任务，快，配置简单
// rollup 适合前端的库 react vue
// webpack 打包工具
const gulp = require("gulp")
const babel = require("gulp-babel")
const watch = require("gulp-watch")

// * windows不能识别
const entry = "./src/server/**/*.js"

// 开发环境
function builddev() {
    return watch(entry, {ignoreInitial: false}, function () {
        gulp.src(entry)
            .pipe(babel({
                // 关闭掉外部的babelrc
                babelrc: false,
                'plugins': [
                    // 编译import
                    '@babel/plugin-transform-modules-commonjs'
                ]
            }))
            .pipe(gulp.dest('dist'))
    })
}
// 生产环境
function buildprod() {
    
}

// 清洗流
function buildconfig() {
    
}

// 代码校验
let build = gulp.series(builddev)
if(process.env.NODE_ENV == 'development') {

}
gulp.task('default', build)