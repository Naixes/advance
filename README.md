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

​	