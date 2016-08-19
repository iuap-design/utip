const fs = require('fs');
const envPath = process.cwd();
const exec = require('child_process').exec;
const chalk = require('chalk');
const fse = require('fs-extra');
const path = require('path');

// 仓库名
const frameDir = [
	'sparrow',
	'neoui',
	'kero',
	'kero-adapter'
];

const dirs = fs.readdirSync(envPath); // 输出当前目录下的目录名

module.exports = function() {
	console.log('发包');

	var pubFun = {
		init: function(){
			this.whole();
		}
	}



}

