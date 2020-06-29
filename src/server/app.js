import Koa from 'Koa'
import serve from 'koa-static'
import log4js from 'log4js'

import config from './config'
import errorHandler from './middleware/errorHandler'

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

// 初始化所有路由
import controllers from './controllers'
controllers(app)

// 静态资源，可以设置过期时间默认访问文件等
app.use(serve(config.staticDir))

// 模板，swig
import co from 'co'
import render from 'koa-swig'

// app.context相当于ctx的原型
// 可以放一些全局参数
app.context.render = co.wrap(render({
	root: config.viewDir, // 指定模板
	autoescape: true,
	// cache: 'memory', // disable, set to false 缓存 重要！！性能瓶颈 
	cache: false,
	ext: 'html',
	varControls: ["[[", "]]"], // 配置模板字符串，防止和vue的{{}}冲突

	writeBody: false
}));

app.listen(config.port, () => {
	console.log('服务启动成功')
})