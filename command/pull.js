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
	'neoui-kero',
	'tinper-neoui-grid',
	'tinper-neoui-tree',
	'tinper-neoui-polyfill',
	'compox',
	'compox-util',
	'kero-fetch',
	'neoui-kero-mixin',
	'tinper-moy'
];

const dirs = fs.readdirSync(envPath); // 输出当前目录下的目录名

module.exports = (options) => {
	var inputConfig = options||{};

	var buildFun = {
		init: function() {
			this.pull();
			console.log(chalk.green(`\n √ 已pull拉取更新各仓库`));
		},

		pull: function(){

			// console.log(dirs);
			frameDir.forEach(function(name){
				var branch = inputConfig.branch||'release';
				if(dirs.indexOf(name) == -1){
					console.log(name + '正在从远程仓库克隆&cnpm下载依赖');
					var resUrl = `git@github.com:iuap-design/${name}.git`;
					console.log(resUrl);
					var cloneCMD = `git clone git@github.com:iuap-design/${name}.git && cd ${name} && git checkout ${branch} && git pull origin ${branch} && cnpm install && cd ..`;
					execSync(cloneCMD, (error, stdout, stderr) => {
				      if (error) {
				        console.log(error)
				        process.exit()
				      }
				      console.log(chalk.green(`\n √ 已clone ${name}仓库并切换至${branch}分支`))
				      process.exit()
				    })
				}

				var cloneCMD = `cd ${name} && git checkout ${branch} && git pull origin ${branch} && cd ..`;
				execSync(cloneCMD, (error, stdout, stderr) => {
			      if (error) {
			        console.log(error)
			        process.exit()
			      }
			      console.log(chalk.green(`\n √ 已更新 ${name}仓库并切换至${branch}分支`))
			      process.exit()
			    })
			});

			// git@github.com:iuap-design/sparrow.git
			// git@github.com:iuap-design/neoui-kero.git
			// git@github.com:iuap-design/kero.git
			// git@github.com:iuap-design/neoui.git
		}
	};

	buildFun.init();
};
