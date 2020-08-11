const argv = require("yargs-parser")(process.argv.slice(2)) // 可以转换为key，value格式

const _mode = argv.mode || "development"
const _mergeConfig = require(`./config/webpack.${_mode}`)

const merge = require("webpack-merge")
const glob = require('glob')

const files = glob.sync("./src/web/views/**/*.entry.js")
for(let item of files) {
    console.log(item)
    if(/.+\/([a-zA-Z]+-[a-zA-Z]+)(\.entry\.js$)/g.test(item)) {
        // 第一个分组的内容
        const entryKey = RegExp.$1
        // html-plugin
        // 注册插件 html-plugin 送到dist之前拦截 插入静态资源
    }
}
const _entry = {}

let webpackConfig = {
    entry: _entry
}

module.exports = merge(webpackConfig, _mergeConfig)
