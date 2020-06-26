// 引入模型
const Index = require('../models/Index')
const {URLSearchParams} = require("url")

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
			// ctx.body = await ctx.render('add')
			// 构建参数：php
			const params = new URLSearchParams()
			params.append("books[name]", "测试")
			params.append("books[author]", "数据")
			const index = new Index()
			const result = await index.saveData({params})
			ctx.body = result
		}
	}
}

module.exports = IndexController