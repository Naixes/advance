# 开发日记

## 项目初始化

### 项目结构

### 安装包

koa

supervisor

koa-simple-router：在koajs的middleware里面找

### 部分代码

#### 路由：koa-simple-router

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

#### 模板：swig

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

#### 静态资源：koa-static

```js

```

#### 使用vue

#### 容错

#### 日志管理log4js