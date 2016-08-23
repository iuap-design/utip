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
	'kero-adapter',
	'neoui-grid',
	'neoui-tree'
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
			var newSparrow,newNeoui,newKero;
			frameDir.forEach(function(resname){
				var originVersion = require(envPath+ '/' + resname + '/package.json').version.split('.');
				originVersion[originVersion.length-1]++;
				var newVersion = originVersion.join('.');
				console.log(newVersion);
				
				// 读取写入替换内容-按时取消write
				var readData = fs.readFileSync(envPath+ '/' + resname + '/package.json', 'utf-8');
				var result = readData.replace(/("version":\s*")(\d+.\d+.\d+)"/,`$1${newVersion}"`);
				fs.writeFileSync(envPath+ '/' + resname + '/package.json',result, 'utf-8');


				// 执行路径
				var resPath = envPath+ '/' + resname;
				var command;
				console.log(resPath);


				// 更改依赖
				switch (resname){
					case 'sparrow':
						console.log('sparrow read');
						newSparrow = newVersion;
						command = `cd ${resPath} && npm run product && npm publish && cd ..`;

						execSync(command, (error, stdout, stderr) => {
					      if (error) {
					        console.log(error)
					        process.exit()
					      }
					      console.log(chalk.green('\n √ 正在测试发包'))
					      process.exit()
					    })
						break;
					case 'neoui':
						console.log(`${resname} read`);
						newNeoui = newVersion;
						command = `cd ${resPath} && npm uninstall neoui-sparrow && npm install neoui-sparrow@${newSparrow} --save && npm run product && npm publish && cd ..`;

						execSync(command, (error, stdout, stderr) => {
					      if (error) {
					        console.log(error)
					        process.exit()
					      }
					      console.log(chalk.green('\n √ 正在测试发包'))
					      process.exit()
					    })
						break;
					case 'kero':
						console.log(`${resname} read`);
						newKero = newVersion;
						command = `cd ${resPath} && npm uninstall neoui-sparrow && npm install neoui-sparrow@${newSparrow} --save && npm run product && npm publish && cd ..`;

						execSync(command, (error, stdout, stderr) => {
					      if (error) {
					        console.log(error)
					        process.exit()
					      }
					      console.log(chalk.green('\n √ 正在测试发包'))
					      process.exit()
					    })
						break;
					case 'kero-adapter':
						console.log('kero-adapter read')
						command = `cd ${resPath} && npm uninstall neoui-sparrow neoui kero && npm install neoui-sparrow@${newSparrow} kero@${newKero} neoui@${newNeoui} --save && npm run product && npm publish && cd ..`;
						execSync(command, (error, stdout, stderr) => {
					      if (error) {
					        console.log(error)
					        process.exit()
					      }
					      console.log(chalk.green('\n √ 正在测试发包'))
					      process.exit()
					    })
					    break;
					case 'neoui-grid':
						console.log('neoui-grid read')
						command = `cd ${resPath} && npm run product && npm publish && cd ..`;
						execSync(command, (error, stdout, stderr) => {
					      if (error) {
					        console.log(error)
					        process.exit()
					      }
					      console.log(chalk.green('\n √ 正在测试发包'))
					      process.exit()
					    })
					    break;
					default:
						console.log('neoui-tree read')
						command = `cd ${resPath} && npm run product && npm publish && cd ..`;
						execSync(command, (error, stdout, stderr) => {
					      if (error) {
					        console.log(error)
					        process.exit()
					      }
					      console.log(chalk.green('\n √ 正在测试发包'))
					      process.exit()
					    })
				}
			});
		}
	}

	pubFun.init();



}

