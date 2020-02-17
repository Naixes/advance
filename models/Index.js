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
	 * 获取后台返回的图书相关数据的方法
	 * @param {*} options 
	 */
	getData(options) {
		const safeRequest = new SafeRequest('book')
		return safeRequest.fetch({})
	}
}
module.exports = Index