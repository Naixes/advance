/**
 * @fileoverview 实现Index数据模型
 * @author Naixes
 */
const SafeRequest = require('../utils/SafeRequest')

/**
 * Index类 获取图书相关数据的类
 * @class
 */
class Index {
	/**
	 * @constructor
	 * @param {string} app KOA2的上下文
	 */
	constructor(app) {
	}

	/**
	 * 获取后台返回的图书相关数据
	 * @param {*} options 
	 */
	getData(options) {
		const safeRequest = new SafeRequest('book')
		return safeRequest.fetch({})
	}

	/**
	 * 保存用户传入数据到接口
	 * @param {*} options 
	 */
	saveData(options) {
		const safeRequest = new SafeRequest('book/create')
		return safeRequest.fetch({
			method: "POST",
			params: options.params
		})
	}
}
module.exports = Index