class IndexController {
	constructor() { }
	actionIndex() {
		return (ctx, next) => {
			console.log('///')
			ctx.body = 'hello'
		}
	}
}

module.exports = IndexController