const fs = require('fs');
const envPath = process.cwd();
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const fse = require('fs-extra');
const path = require('path');

// 仓库名
const frameDir = [
	'tinper-sparrow',
	'tinper-neoui',
	'kero',
	'tinper-neoui-grid',
	'tinper-neoui-tree',
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
					case 'tinper-sparrow':
						newSparrow = newVersion;
						command = `cd ${resPath} && git tag v${newSparrow} && git push origin v${newSparrow}  && npm run product && npm run changelog && npm publish && git add . && git commit -m 'npm publish' && git push origin release && cd ..`;
						execSync(command);
						break;
					case 'tinper-neoui':
						newNeoui = newVersion;
						command = `cd ${resPath} && npm uninstall tinper-sparrow && npm install tinper-sparrow@${newSparrow} --save && git tag v${newNeoui} && git push origin v${newNeoui} && npm run product && npm run changelog && npm publish && git add . && git commit -m 'npm publish' && git push origin release && cd ..`;
						execSync(command);
						break;
					case 'kero':
						newKero = newVersion;
						command = `cd ${resPath} && npm uninstall tinper-sparrow && npm install tinper-sparrow@${newSparrow} --save && git tag v${newKero} && git push origin v${newKero} && npm run product && npm run changelog && npm publish && git add . && git commit -m 'npm publish' && git push origin release && cd ..`;
						execSync(command);
						break;
					case 'tinper-neoui-grid':
						newGrid = newVersion;
						command = `cd ${resPath} && git tag v${newGrid} && git push origin v${newGrid} && npm run product && npm run changelog && npm publish && git add . && git commit -m 'npm publish' && git push origin release && cd ..`;
						execSync(command);
					    break;
					case 'tinper-neoui-tree':
						newTree = newVersion;
						command = `cd ${resPath} && git tag v${newTree} && git push origin v${newTree} && npm run product && npm run changelog && npm publish && git add . && git commit -m 'npm publish' && git push origin release && cd ..`;
						execSync(command);
						break;
					case 'tinper-neoui-polyfill':
						newPoly = newVersion;
						command = `cd ${resPath} && git tag v${newPoly} && git push origin v${newPoly} && npm run product && npm run changelog && npm publish && git add . && git commit -m 'npm publish' && git push origin release && cd ..`;
						execSync(command);
						break;
					default:
						newKeroAdapter = newVersion;
						command = `cd ${resPath} && npm uninstall tinper-sparrow tinper-neoui kero tinper-neoui-grid tinper-neoui-tree tinper-neoui-polyfill && npm install tinper-sparrow@${newSparrow} kero@${newKero} tinper-neoui@${newNeoui} tinper-neoui-grid@${newGrid} tinper-neoui-tree@${newTree} tinper-neoui-polyfill@${newPoly} --save && git tag v${newKeroAdapter} && git push origin v${newKeroAdapter} && npm run product && npm run changelog && npm publish && git add . && git commit -m 'npm publish' && git push origin release && cd ..`;
						execSync(command);
				}
			});
		}
	}

	pubFun.init();



}

