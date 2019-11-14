const Koa = require('Koa')

const app = new Koa()
// 初始化所有路由
require('./controllers')(app)

app.listen(3000, () => {
	console.log('服务启动成功')
})