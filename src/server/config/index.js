import { join } from 'path'
import _ from 'lodash'

let config = {
	"viewDir": join(__dirname, '..', 'views'),
	"staticDir": join(__dirname, '..', 'assets')
}

// 测试清洗
if(false) {
	console.log('lalala~')
}

if (process.env.NODE_ENV === 'development') {
	const localConfig = {
		port: 3000,
		baseUrl: 'http://localhost/phpsystem/basic/web/index.php?r='
	}
	config = _.extend(config, localConfig)
}

if (process.env.NODE_ENV === 'production') {
	const prodConfig = {
		port: 80
	}
	config = _.extend(config, prodConfig)
}

module.exports = config