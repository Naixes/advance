const argv = require("yargs-parser")(process.argv.slice(2)) // 可以转换为key，value格式

const _mode = argv.mode || "development"
const _mergeConfig = require(`./config/webpack.${_mode}`)