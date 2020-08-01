// gulp 适合处理一些小任务，快，配置简单
// rollup 适合前端的库 react vue
// webpack 打包工具
const gulp = require("gulp")
const babel = require("gulp-babel")
const watch = require("gulp-watch")
const rollup = require("gulp-rollup")
const replace = require("rollup-plugin-replace")
const eslint = require("gulp-eslint")
const { src } = require("gulp")

// * windows不能识别
const entry = "./src/server/**/*.js"
const clearEntry = "./src/server/config/index.js"

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
    return gulp.src(entry)
        .pipe(babel({
            // 关闭掉外部的babelrc
            babelrc: false,
            // 忽略清洗的内容
            ignore: [clearEntry],
            'plugins': [
                // 编译import
                '@babel/plugin-transform-modules-commonjs'
            ]
        }))
        .pipe(gulp.dest('dist'))
}

// 清洗流：只清洗配置文件
// tree shaking
function buildconfig() {
    return gulp.src(entry)
        .pipe(rollup({
            plugins: [
                // 变量替换
                replace({
                    'process.env.NODE_ENV': JSON.stringify('production')
                })
            ],
            output: {
                format: 'cjs'
            },
            input: clearEntry
        }))
        .pipe(gulp.dest('dist'))
}

// 代码校验
function buildhint() {
    return hulp.src(entry)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
}

let build = gulp.series(builddev)
console.log(process.env.NODE_ENV)

if(process.env.NODE_ENV == 'production') {
    // 先完成核心的编译流程，再完成清洗node代码流程
    build = gulp.series(buildprod, buildconfig)
}

// eslint需要创建配置文件.eslintrc
if(process.env.NODE_ENV == 'hint') {
    build = gulp.series(buildhint)
}
gulp.task('default', build)