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
	'tinper-neoui-polyfill',
	'compox',
	'compox-util',
	'kero-fetch',
	'neoui-kero-mixin'
];

// gtree仓库-输出迁移目录至kero-adapter
const gtreeDir = [
	'tinper-neoui-grid',
	'tinper-neoui-tree',
	'tinper-neoui-polyfill'
];

// npm依赖
const npmDir = [
	'tinper-sparrow',
	'tinper-neoui',
	'kero',
	'kero-fetch',
	'compox-util',
	'compox',
	'neoui-kero-mixin'
];

const rootList = {
	"tinper-sparrow":["tinper-neoui", "kero", "kero-adapter","compox","compox-util","kero-fetch","neoui-kero-mixin"],
	"tinper-neoui":["kero-adapter","neoui-kero-mixin"],
	"kero":["kero-adapter"],
	"kero-fetch":["kero-adapter"],
	"compox":["compox-util","kero-adapter","tinper-neoui","tinper-sparrow"],
	"compox-util":["kero-adapter"],
	"neoui-kero-mixin":["kero-adapter"]
};

const dirs = fs.readdirSync(envPath); // 输出当前目录下的目录名

module.exports = (options) => {
	var inputConfig = options||{};

	var buildFun = {
		init: function() {
			this.whole();
			console.log(chalk.green(`\n √ 已clone更新各仓库，准备清空dist目录`));

			fse.emptyDirSync('./tinper-neoui/dist');
			fse.emptyDirSync('./tinper-neoui-grid/dist');
			fse.emptyDirSync('./tinper-neoui-tree/dist');
			fse.emptyDirSync('./kero-adapter/dist');
			console.log(chalk.green(`\n √ 已清空dist目录，准备执行neoui输出`));


			this.ucss();
			console.log(chalk.green(`\n √ 已执行输出neoui，完成样式&静态资源拷贝`));

			this.gtree();
			console.log(chalk.green(`\n √ 已执行输出grid,tree,polyfill,完成拷贝`));

			for(var i=0; i<npmDir.length; i++){
				this.copy(npmDir[i]);
			}
			console.log(chalk.green(`\n √ 已复制源码,准备输出最终目录`));

			this.dist();
			console.log(chalk.green(`\n √ 完成：kero-adapter已输出最新dist目录`));

		},

		/**
		 * 判断依赖库是否下载完成
		 * 如未下载，则下载本地仓库并使用npm install安装包
		 */
		whole: function(){

			// console.log(dirs);
			frameDir.forEach(function(name){

				var branch = inputConfig.branch||'release';

				if(dirs.indexOf(name) == -1){
					console.log(name + '正在从远程仓库克隆&npm下载依赖');
					var resUrl = `git@github.com:iuap-design/${name}.git`;
					console.log(resUrl);
					var cloneCMD = `git clone git@github.com:iuap-design/${name}.git && cd ${name} && git checkout ${branch} && git pull origin ${branch} && npm install && cd ..`;
					execSync(cloneCMD, (error, stdout, stderr) => {
				      if (error) {
				        console.log(error)
				        process.exit()
				      }
				      console.log(chalk.green(`\n √ 已clone ${name}仓库并切换至${branch}分支`))
				      process.exit()
				    })
				}

				if(inputConfig.mode == 'local'){
					return;
				} else {
					var cloneCMD = `cd ${name} && git checkout ${branch} && git pull origin ${branch} && cd ..`;

					execSync(cloneCMD, (error, stdout, stderr) => {
				      if (error) {
				        console.log(error)
				        process.exit()
				      }
				      console.log(chalk.green(`\n √ 已更新 ${name}仓库并切换至${branch}分支`))
				      process.exit()
				    })
				}
			});

			// git@github.com:iuap-design/sparrow.git
			// git@github.com:iuap-design/kero-adapter.git
			// git@github.com:iuap-design/kero.git
			// git@github.com:iuap-design/neoui.git
		},

		/**
		 * 复制拷贝各仓库依赖文件到对应的相依赖的文件下,以便于没有发布的依赖包测试
		 */
		copy: function(copyname){
			// 优化筛选，方便后期维护，使用switch.case
			switch(copyname){
				case "tinper-sparrow":
					rootList["tinper-sparrow"].forEach( function(element, index) {
						fse.copySync(envPath + '/tinper-sparrow/js', envPath +'/'+ element +'/node_modules/tinper-sparrow/js');
					});
					break;
				case "tinper-neoui":
					rootList["tinper-neoui"].forEach( function(element, index) {
						fse.copySync(envPath + '/tinper-neoui/js', envPath +'/'+ element +'/node_modules/tinper-neoui/js');
					});
					break;
				case "kero":
					rootList["kero"].forEach( function(element, index) {
						fse.copySync(envPath + '/kero/js', envPath +'/'+ element +'/node_modules/kero/js');
					});
					break;
				case "compox":
					rootList["compox"].forEach( function(element, index) {
						fse.copySync(envPath + '/compox/js', envPath +'/'+ element +'/node_modules/compox/js');
					});
					break;
				case "compox-util":
					rootList["compox-util"].forEach( function(element, index) {
						fse.copySync(envPath + '/compox-util/js', envPath +'/'+ element +'/node_modules/compox-util/js');
					});
					break;
				case "kero-fetch":
					rootList["kero-fetch"].forEach( function(element, index) {
						fse.copySync(envPath + '/kero-fetch/js', envPath +'/'+ element +'/node_modules/kero-fetch/js');
					});
					break;
				case "neoui-kero-mixin":
					rootList["neoui-kero-mixin"].forEach( function(element, index) {
						fse.copySync(envPath + '/neoui-kero-mixin/js', envPath +'/'+ element +'/node_modules/neoui-kero-mixin/js');
					});
					break;
			}
		},

		/**
		 * neoui仓库增加输出u.css并复制到kero-adapter/node_modules/neoui/dist中
		 */
		ucss: function(){
			const uiDir = envPath + '/tinper-neoui';
			// 优化：替换npm run product
			const cssCMD = `cd ${uiDir} && npm run utipbuild && cd ..`;

			execSync(cssCMD);

			const neoDir = './tinper-neoui/dist/';
			const neoModuleDir = './kero-adapter/node_modules/tinper-neoui/dist/';
			const neoAry = ['css', 'fonts', 'images'];

			for(var i=0; i<neoAry.length; i++){
				var dirExist = fse.ensureDirSync(`${neoModuleDir}${neoAry[i]}`);
				if(! dirExist) {
					console.log(`创建kero-adapter依赖模块neoui的输出目录dist/${neoAry[i]}`);
					fse.mkdirsSync(`${neoModuleDir}${neoAry[i]}`);
				}

				fse.copySync(`${neoDir}${neoAry[i]}`, `${neoModuleDir}${neoAry[i]}`);
			}
		},

		/**
		 * grid,tree输出复制到kero-adapter/node_modules/grid/dist
		 */
		gtree: function(){
			gtreeDir.forEach(function(name){
				// 优化npm run product
				var treeCMD = `cd ./${name} && npm run product && cd ..`;
				execSync(treeCMD);
				var treeDist = `./${name}/dist`;
				var treeModuleDist = `./kero-adapter/node_modules/${name}/dist`;
				fse.copySync(`${treeDist}`, `${treeModuleDist}`);
			});

		},

		/**
		 * 输出u.js
		 */
		dist: function(){
			var adapterPath = path.join(envPath ,"kero-adapter");
			var command = `cd ${adapterPath} && npm run utipbuild`;
			execSync(command);
			console.log('complete');
			// execSync(command, (error, stdout, stderr) => {
		    //   if (error) {
		    //     console.log(error)
		    //     process.exit()
		    //   }
		    //   console.log(chalk.green('\n √ 已生成测试用u.js'))
		    //   process.exit()
		    // })
		}
	};

	buildFun.init();
};
