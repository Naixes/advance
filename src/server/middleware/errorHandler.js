const errorHandler = {
	error(app, logger) {
		// 500
		app.use(async (ctx, next) => {
			try {
				await next()
			} catch (error) {
				// 微信，电话，邮件等报警
				logger.error(error)
				ctx.status = 500
				ctx.body = '苦海无涯，回头是岸'
				// 或者返回一个页面
				// ctx.render('error')
			}
		})
		// 404
		app.use(async (ctx, next) => {
			await next()
			if (404 !== ctx.status) {
				return
			}
			// 有很多项目即使出现了404也会返回200，是为了防止百度降权
			ctx.status = 404
			ctx.body = '<script type="text/javascript" src="//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js" charset="utf-8"></script>'
		})
	}
}

module.exports = errorHandler