# 开发日志

## 项目初始化

### 项目结构

### 安装包

koa

supervisor

koa-simple-router：在koajs的middleware里面找

## 开发

### 路由：koa-simple-router

```js
// package.json
"server:dev": "supervisor ./app.js"

// app.js
const Koa = require('Koa') 

const app = new Koa()
// 初始化所有路由
require('./controllers/index')(app)

app.listen(3000, () => {
	console.log('服务启动成功')
})

// controllers/IndexController.js
class IndexController {
	constructor() {}
	actionIndex() {
		return (ctx, next) => {
			ctx.body = 'hello'
		}
	}
}

module.exports = IndexController

// controllers/index.js
// 路由的注册机制
const router = require('koa-simple-router')
const IndexController = require('./IndexController')

const indexController = new IndexController()

module.exports = (app) => {
	app.use(router(_ => {
		// 伪静态，优化SEO
		_.get('/index.html', indexController.actionIndex())
		_.get('/', indexController.actionIndex())
	}))
}
```

### 模板：swig

安装：koa-awig

```js
// app.js
const Koa = require('Koa')
const { join } = require('path')

const app = new Koa()
// 初始化所有路由
require('./controllers')(app)

// swig
const co = require('co');
const render = require('koa-swig');

app.context.render = co.wrap(render({
	root: join(__dirname, 'views'), // 指定模板
	autoescape: true,
	cache: 'memory', // disable, set to false 缓存 重要！！性能瓶颈 
	ext: 'html',

	writeBody: false
}));

app.listen(3000, () => {
	console.log('服务启动成功')
})

// IndexController.js
class IndexController {
	constructor() { }
	actionIndex() {
		return async (ctx, next) => {
			// ctx.body = 'hello'
			ctx.body = await ctx.render('index')
		}
	}
}

module.exports = IndexController
```

### 静态资源：koa-static

```js
// html
...

{% block styles %}
<!-- 注意引入时不要加上assets路径 -->
<link rel="stylesheet" href="/styles/index.css">
{% endblock  %}

...

{% block scripts %}
<script src="/scripts/index.js"></script>
{% endblock  %}

// app.js
...
const Koa = require('Koa')
const serve = require('koa-static');
const { join } = require('path')

const app = new Koa()
// 初始化所有路由
require('./controllers')(app)

// 静态资源
app.use(serve(join(__dirname, 'assets')))
...
```

### 使用vue

```js
// index.html
...
<div id="app">
	<!-- {{}}可能会和swig的模板有冲突需要手动设置 -->
	<!-- csr -->
	<h2>{{message}}</h2>
	<input v-model="message">
</div>
{% endblock %}

{% block scripts %}
// 引入
<script src="https://cdn.bootcss.com/vue/2.6.10/vue.js"></script>
<script src="/scripts/index.js"></script>
{% endblock  %}

// index.js
console.log('js success')

var app = new Vue({
    el: '#app',
    data: {
        message: 'hello vue'
    }
})

// app.js
app.context.render = co.wrap(render({
	root: join(__dirname, 'views'), // 指定模板
	autoescape: true,
	cache: 'memory', // disable, set to false 缓存 重要！！性能瓶颈 
	ext: 'html',
	varControls: ["[[", "]]"], // 配置模板字符串，防止和vue的{{}}冲突

	writeBody: false
}));
```

### 容错

#### 日志管理log4js

```js
// app.js
...

const log4js = require('log4js')
const errorHandler = require('./middleware/errorHandler')

// 日志
// node不记服务的日志只记业务的错误，一般nginx来记这些，有专门的日志服务器
log4js.configure({
	// {name: {type, filename}}
	appenders: { slog: { type: 'file', filename: 'logs/advance.log' } },
	categories: { default: { appenders: ['slog'], level: 'error' } }
});
const logger = log4js.getLogger('slog')
// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Comté.');
// logger.warn('Cheese is quite smelly.');
// logger.error('Cheese is too ripe!');
// logger.fatal('Cheese was breeding ground for listeria.');

const app = new Koa()

// 处理错误
errorHandler.error(app, logger)

...

// errorHandler
const errorHandler = {
	error(app, logger) {
		// 500
		app.use(async (ctx, next) => {
			try {
				await next()
			} catch (error) {
				// 微信，电话，邮件等报警
				logger.error(error)
				ctx.status = 500
				ctx.body = '苦海无涯，回头是岸'
				// 或者返回一个页面
				// ctx.render('error')
			}
		})
		// 404
		app.use(async (ctx, next) => {
			await next()
			if (404 !== ctx.status) {
				return
			}
			// 有很多项目即使出现了404也会返回200，是为了防止百度降权
			ctx.status = 404
			ctx.body = '<script type="text/javascript" src="//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js" charset="utf-8"></script>'
		})
	}
}

module.exports = errorHandler
```

### 优化配置

```js
// config/index.js
const { join } = require('path');
const _ = require('lodash')

let config = {
	"viewDir": join(__dirname, '..', 'views'),
	"staticDir": join(__dirname, '..', 'assets')
}

if (process.env.NODE_ENV === 'development') {
	const localConfig = {
		port: 3000
	}
	config = _.extend(config, localConfig)
}

if (process.env.NODE_ENV === 'production') {
	const prodConfig = {
		port: 80
	}
	config = _.extend(config, prodConfig)
}

module.exports = config

// package.json
"scripts": {
    ...
    "server:dev": "cross-env NODE_ENV=development supervisor ./app.js"
},
```

此时完成了一个简单的egg

### systemjs

```js
class Create {
	constructor() { }
	fn() {
		console.log('es6 初始化')
	}
}

// 浏览器报错，不支持export语法
export default Create
```

解决方法：使用systenjs

1. 引入并使用system

```html
// add.html
```

2. 让system支持es6语法：使用babel

   创建.babelrc文件

   安装@babel/cli @babel/core @babel/preset-env

   支持systemjs：安装@babel/plugin-transform-modules-systemjs

```js
{
	"presets": [
		"@babel/preset-env"
	],
	"plugins": [
		"@babel/plugin-transform-modules-systemjs"
	]
}
```

### 	SafeRequest

```js
const fetch = require('node-fetch')
const config = require('./config')

class SafeRequest {
	constructor(url) {
		this.url = url
		this.baseUrl = config.baseUrl
	}

	// 返回重新封装的一个Promise，对请求过程中的错误进行拦截，避免后台接口错误影响前端
	fetch(options) {
		let sfetch = fetch(this.baseUrl + this.url)
		return new Promise((resolve, reject) => {
			let result = {
				code: 0,
				message: '',
				data: []
			}
			sfetch.then(res => {
				let _json = {}
				try {
					_json = res.json()
				} catch (err) {
					// 发邮件等
					// ...
				}
				return _json
			}).then(json => {
				// 一些沟通好的交互形式
				// ...
				result.data = json
				resolve(result)
			}).catch((err) => {
				result.code = 1
				result.message = 'node-fetch err'
				// 发邮件，记日志等
				// ...
				reject(result)
			})
		})
	}
}

module.exports = SafeRequest
```

#jsdoc（jsAPI文档生成器os系统）

### package.json

#### 生命周期

```js
{
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1", // 1有错退出，0正常退出
		"build": "babel ./assets/scripts/add.js --out-file ./assets/scripts/add-bundle.js",
		"server:dev": "cross-env NODE_ENV=development supervisor ./app.js"
    // 生命周期
		"pretest": "\"echo pretest $LOGNAME\"" // 钩子，可以取变量，$LOGNAME当前系统登录名
    "test:dev": "npm run test && npm run dev" // 同时执行两个命令，&&并行，&串行
    // 其他配置
    "config": {
        "port": 3000
    }
}

// npm run env 可以查看配置变量
```

#### 优化

##### npm-run-all包

```js
{
	"scripts": {
        ...
        "test:dev": "npm run all --parallel test dev", // --parallel改为并行，默认串行
        ...
}
```

#### 工程化配置

```js
{
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1", // 1有错退出，0正常退出
    "start": "",
    "build": "",
         
    "es:build": "babel ./assets/scripts/add.js --out-file ./assets/scripts/add-bundle.js",
      
    "test:dev": "npm run all --parallel test dev",
    "server:start": "cross-env NODE_ENV=development supervisor ./app.js", // 开发的后端
    "server:dev": "cross-env NODE_ENV=development gulp", // 开发的后端
    "server:prod": "cross-env NODE_ENV=production gulp", // 线上的后端
    "server:hint": "cross-env NODE_ENV=hint gulp", // js脚本校验
    "client:dev": "webpack --mode development", // 开发的前端
    "client:prod": "webpack --mode production" // 线上的前端
}
```

根据配置新建文件夹scripts-》server-》dev.sh/start.sh/prod.sh/hint.sh...

安装包scripty

```js
// start.sh
#!/usr/bin/env sh
cross-env NODE_ENV=development supervisor ./app.js
...
// package.json
{
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1", // 1有错退出，0正常退出
    "start": "",
    "build": "",
             
		"es:build": "babel ./assets/scripts/add.js --out-file ./assets/scripts/add-bundle.js",
    "test:dev": "npm run all --parallel test dev",
		"server:start": "scripty", // 开发的后端
		"server:dev": "scripty", // 开发的后端
		"server:prod": "scripty", // 线上的后端
		"server:hint": "scripty", // js脚本校验
    "client:dev": "scripty", // 开发的前端
    "client:prod": "scripty" // 线上的前端
}
// 注意可执行权
chmod -R a+x scripts // 更改权限
```

### webpack.config.js

处理process.argv

```js
// "client:dev": "webpack --mode development", 执行client:dev
console.log(process.argv.slice(2)) // [webpack的执行环境,webpack路径,"--mode","development"]

const argv = require("yargs-parser") // 可以转换为key，value格式
console.log(argv(process.argv.slice(2)))
```

新建文件夹config-》webpack.development.js/webpack.production.js

```js
// webpack.config.js
const argv = require("yargs-parser")(process.argv.slice(2)) // 可以转换为key，value格式

const _mode = argv.mode || "development"
const _mergeConfig = require(`./config/webpack.${_mode}`)
```

 备份oop版本的server

将require改为import（面向未来编程，好用 ），app.js和config

使用gulp编译app.js，因为node不支持import

```js
// gulp 适合处理一些小任务，快，配置简单
// rollup 适合前端的库 react vue
// webpack 打包工具
// gulpfile
const gulp = require("gulp")
const babel = require("gulp-babel")
const watch = require("gulp-watch")

const entry = "./src/server/**/*.js"
```

优化config

