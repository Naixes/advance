const { join } = require('path')
const Koa = require('Koa')
const serve = require('koa-static');
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

// 初始化所有路由
require('./controllers')(app)

// 静态资源
app.use(serve(join(__dirname, 'assets')))

// 模板，swig
const co = require('co');
const render = require('koa-swig');

app.context.render = co.wrap(render({
	root: join(__dirname, 'views'), // 指定模板
	autoescape: true,
	cache: 'memory', // disable, set to false 缓存 重要！！性能瓶颈 
	ext: 'html',
	varControls: ["[[", "]]"], // 配置模板字符串，防止和vue的{{}}冲突

	writeBody: false
}));

app.listen(3000, () => {
	console.log('服务启动成功')
})