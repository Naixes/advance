const fetch = require('node-fetch')
const config = require('../config')

class SafeRequest {
	constructor(url) {
		this.url = url
		this.baseUrl = config.baseUrl
	}

	// 返回重新封装的一个Promise，对请求过程中的错误进行拦截，避免后台接口错误影响前端
	fetch(options) {
		let sfetch = fetch(this.baseUrl + this.url)
		return new Promise((resolve, reject) => {
			let result = {
				code: 0,
				message: '',
				data: []
			}
			sfetch.then(res => {
				let _json = {}
				try {
					_json = res.json()
				} catch (err) {
					// 发邮件等
					// ...
				}
				return _json
			}).then(json => {
				// 一些沟通好的交互形式
				// ...
				result.data = json
				resolve(result)
			}).catch((err) => {
				result.code = 1
				result.message = 'node-fetch err'
				// 发邮件，记日志等
				// ...
				reject(result)
			})
		})
	}
}

module.exports = SafeRequest
