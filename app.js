const Koa = require('Koa')
const serve = require('koa-static');
const { join } = require('path')

const app = new Koa()
// 初始化所有路由
require('./controllers')(app)

// 静态资源
app.use(serve(join(__dirname, 'assets')))

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