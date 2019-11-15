class IndexController {
	constructor() { }
	actionIndex() {
		return async (ctx, next) => {
			// ctx.body = 'hello'
			ctx.body = await ctx.render('index', {
				data: 'hello sin'
			})
		}
	}
}

module.exports = IndexController