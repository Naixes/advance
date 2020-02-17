// 引入模型
const Index = require('../models/Index')

class IndexController {
	constructor() { }
	actionIndex() {
		return async (ctx, next) => {
			const index = new Index()
			const result = await index.getData()
			const data = result.data
			ctx.body = await ctx.render('index', { data })
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