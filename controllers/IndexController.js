class IndexController {
	constructor() { }
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