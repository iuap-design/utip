const fs = require('fs');
const envPath = process.cwd();
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const fse = require('fs-extra');
const path = require('path');

// 仓库名
const frameDir = [
	'sparrow',
	'neoui',
	'kero',
	'neoui-grid',
	'neoui-tree',
	'tinper-neoui-polyfill',
	'kero-adapter'
];

const dirs = fs.readdirSync(envPath); // 输出当前目录下的目录名

module.exports = function() {
	console.log('发包');

	var pubFun = {
		init: function() {
			this.pkg();
		},
		/**
		 * 更改各仓库package.json文件,并提交
		 */
		pkg: function() {
			var newSparrow,newNeoui,newKero,newGrid,newTree,newPoly;
			frameDir.forEach(function(resname){
				var originVersion = require(envPath+ '/' + resname + '/package.json').version.split('.');
				console.log(`${resname}老版本为${originVersion}`);
				originVersion[originVersion.length-1]++;
				var newVersion = originVersion.join('.');
				console.log(`${resname}准备更新的版本为${newVersion}`);
				
				// 读取写入替换内容-按时取消write
				var readData = fs.readFileSync(envPath+ '/' + resname + '/package.json', 'utf-8');
				var result = readData.replace(/("version":\s*")(\d+.\d+.\d+)"/,`$1${newVersion}"`);
				fs.writeFileSync(envPath+ '/' + resname + '/package.json',result, 'utf-8');


				// 执行路径
				var resPath = envPath+ '/' + resname;
				var command;
				// console.log(resPath);

				// 更改依赖
				console.log(`${resname} 执行输出发包`);
				switch (resname){
					case 'sparrow':
						newSparrow = newVersion;
						command = `cd ${resPath} && npm run product && npm publish && git add . && git commit -m 'npm publish' && git push origin release && cd ..`;
						execSync(command);
						break;
					case 'neoui':
						newNeoui = newVersion;
						command = `cd ${resPath} && npm uninstall neoui-sparrow && npm install neoui-sparrow@${newSparrow} --save && npm run product && npm publish && git add . && git commit -m 'npm publish' && git push origin release && cd ..`;
						execSync(command);
						break;
					case 'kero':
						newKero = newVersion;
						command = `cd ${resPath} && npm uninstall neoui-sparrow && npm install neoui-sparrow@${newSparrow} --save && npm run product && npm publish && git add . && git commit -m 'npm publish' && git push origin release && cd ..`;
						execSync(command);
						break;
					case 'neoui-grid':
						newGrid = newVersion;
						command = `cd ${resPath} && npm run product && npm publish && git add . && git commit -m 'npm publish' && git push origin release && cd ..`;
						execSync(command);
					    break;
					case 'neoui-tree':
						newTree = newVersion;
						command = `cd ${resPath} && npm run product && npm publish && git add . && git commit -m 'npm publish' && git push origin release && cd ..`;
						execSync(command);
						break;
					case 'tinper-neoui-polyfill':
						newPoly = newVersion;
						command = `cd ${resPath} && npm run product && npm publish && git add . && git commit -m 'npm publish' && git push origin release && cd ..`;
						execSync(command);
						break;
					default:
						command = `cd ${resPath} && npm uninstall neoui-sparrow neoui kero neoui-grid neoui-tree neoui-polyfill && npm install neoui-sparrow@${newSparrow} kero@${newKero} neoui@${newNeoui} neoui-grid@${newGrid} neoui-tree@${newTree} neoui-polyfill@${newPoly} --save && npm run product && npm publish && git add . && git commit -m 'npm publish' && git push origin release && cd ..`;
						execSync(command);
				}
			});
		}
	}

	pubFun.init();



}

