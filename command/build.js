const fs = require('fs');
const envPath = process.cwd();
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const fse = require('fs-extra');
const path = require('path');


// 仓库名-用于克隆或者更新仓库
const frameDir = [
	'sparrow',
	'tinper-neoui',
	'kero',
	'kero-adapter',
	'tinper-neoui-grid',
	'tinper-neoui-tree',
	'tinper-neoui-polyfill'
];

// gtree仓库-输出迁移目录至kero-adapter 
const gtreeDir = [
	'tinper-neoui-grid',
	'tinper-neoui-tree',
	'tinper-neoui-polyfill'
];

// npm包名-kero-adapter js依赖
const npmDir = [ 
	'neoui-sparrow',
	'tinper-neoui',
	'kero'
];

const rootList = {
	"neoui-sparrow":["neoui", "kero", "kero-adapter"],
	"tinper-neoui":["kero-adapter"],
	"kero":["kero-adapter"]
};

const dirs = fs.readdirSync(envPath); // 输出当前目录下的目录名

module.exports = (options) => {
	var inputConfig = options;

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
		 * 如未下载，则下载本地仓库并使用cnpm install安装包
		 */
		whole: function(){
			
			// console.log(dirs);
			frameDir.forEach(function(name){
				if(dirs.indexOf(name) == -1){
					console.log(name + '正在从远程仓库克隆&cnpm下载依赖');
					var resUrl = `git@github.com:iuap-design/${name}.git`;
					console.log(resUrl);
					var cloneCMD = `git clone git@github.com:iuap-design/${name}.git && cd ${name} && git checkout release && git pull origin release && cnpm install && cd ..`;
					execSync(cloneCMD, (error, stdout, stderr) => {
				      if (error) {
				        console.log(error)
				        process.exit()
				      }
				      console.log(chalk.green(`\n √ 已clone ${name}仓库`))
				      process.exit()
				    })
				}
				
				if(inputConfig.mode == 'local'){
					return;
				} else {
					var cloneCMD = `cd ${name} && git checkout release && git pull origin release && cd ..`;
					execSync(cloneCMD, (error, stdout, stderr) => {
				      if (error) {
				        console.log(error)
				        process.exit()
				      }
				      console.log(chalk.green(`\n √ 已更新 ${name}仓库`))
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
		 * 复制拷贝各仓库js文件到kero-adapter下
		 */
		copy: function(copyname){
			// 未优化前:所有根目录下仓库都会遍历拷贝
			/*
			var paths = fs.readdirSync(envPath);
			var loopFun = function(paths) {

				paths.forEach(function(path){
					// 此处路径不能使用__dirname,会指向插件的路径
					var _path = envPath + '/' + path + '/node_modules';
					var nextMod = path + '/node_modules';
					

					// 判断子集nodemodules是否存在
					if(fs.existsSync(_path)){

						var st = fs.statSync(_path);

						if(st.isDirectory()){
							// 存在
							var subpaths = fs.readdirSync(_path);
							subpaths.forEach(function(subpath) {
								// console.log(subpath);
								try {

									// 未优化
								  	if(copyname == 'neoui-sparrow'){
								  		fse.copySync(envPath + '/' + 'sparrow' + '/js', _path +'/'+ copyname +'/js')
								  	} else {
								  		fse.copySync(envPath + '/' + copyname + '/js', _path +'/'+ copyname +'/js')
								  	}
								} catch (err) {
								  console.error(err)
								}
							});
							var nextModAry = [nextMod];
							loopFun(nextModAry);
						} else {
							// 不存在
						}
					}
						
				});
			};
			loopFun(paths);
			*/

			// 调整后
			// 优化筛选，方便后期维护，使用switch.case
			switch(copyname){
				case "neoui-sparrow":
					rootList["neoui-sparrow"].forEach( function(element, index) {
						fse.copySync(envPath + '/sparrow/js', envPath +'/'+ element +'/node_modules/neoui-sparrow/js');
					});
					break;
				case "neoui":
					rootList["tinper-neoui"].forEach( function(element, index) {
						fse.copySync(envPath + '/tinper-neoui/js', envPath +'/'+ element +'/node_modules/tinper-neoui/js');
					});
					break;
				case "kero":
					rootList["kero"].forEach( function(element, index) {
						fse.copySync(envPath + '/kero/js', envPath +'/'+ element +'/node_modules/kero/js');
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
			const cssCMD = `cd ${uiDir} && webpack --progress --colors --mode=product_normal && gulp dist && cd ..`;
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
			var adapterPath = envPath + "/kero-adapter";
			var command = `cd ${adapterPath} && webpack --colors --progress && gulp dist`;
			execSync(command, (error, stdout, stderr) => {
		      if (error) {
		        console.log(error)
		        process.exit()
		      }
		      console.log(chalk.green('\n √ 已生成测试用u.js'))
		      process.exit()
		    })
		}
	};

	buildFun.init();
};