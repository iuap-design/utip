const fs = require('fs');
const envPath = process.cwd();
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const fse = require('fs-extra');
const path = require('path');

// 仓库名-用于克隆或者更新仓库
const frameDir = [
	'tinper-sparrow',
	'tinper-neoui',
	'kero',
	'kero-adapter',
	'tinper-neoui-grid',
	'tinper-neoui-tree',
	'tinper-neoui-polyfill'
];

const dirs = fs.readdirSync(envPath); // 输出当前目录下的目录名

module.exports = () => {
	frameDir.forEach( function(element, index) {
		var resPath = path.resolve(envPath,element);
		const cssCMD = `cd ${resPath} && git checkout dist/. && git clean -nf dist/. && git clean -f dist/. && cd ..`;
		execSync(cssCMD);
	});

};