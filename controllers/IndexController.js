// 一个模块一个controller
class IndexController {
	constructor() { }
	// 路由处理函数
	actionIndex() {
		return async (ctx, next) => {
			// ctx.body = 'hello'
			ctx.body = await ctx.render('index', {
				data: 'hello sin'
				// 500
				// data
			})
		}
	}
	actionAdd() {
		return async (ctx, next) => {
			// ctx.body = 'hello'
			ctx.body = await ctx.render('add')
		}
	}
}

module.exports = IndexController