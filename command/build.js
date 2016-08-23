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

// gtree仓库
const gtreeDir = [
	'neoui-grid',
	'neoui-tree'
];

// npm包名
const npmDir = [ 
	'neoui-sparrow',
	'neoui',
	'kero',
	'kero-adapter'	
];
const dirs = fs.readdirSync(envPath); // 输出当前目录下的目录名

module.exports = () => {
	
	var buildFun = {
		init: function() {
			this.whole();
			console.log(chalk.green(`\n √ 仓库已clone更新，准备生成u.css`));

			this.ucss();
			console.log(chalk.green(`\n √ neoui已输出复制css&fonts&images`));

			this.gtree();
			console.log(chalk.green(`\n √ grid,tree已输出复制dist目录`));

			for(var i=0; i<npmDir.length; i++){
				this.copy(npmDir[i]);
			}
			console.log(chalk.green(`\n √ 复制已完成,准备输出dist目录`));

			this.dist();
			console.log(chalk.green(`\n √ 完成：kero-adapter已输出最新dist目录`));
			
			
		},

		iswhole: false,

		/**
		 * 判断依赖库是否下载完成
		 * 如未下载，则下载本地仓库并使用cnpm install安装包
		 */
		whole: function(){
			
			// console.log(dirs);
			frameDir.forEach(function(name){
				if(dirs.indexOf(name) == -1){
					console.log(name + '正在从远程仓库克隆');
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

			this.iswhole = true;

			// git@github.com:iuap-design/sparrow.git
			// git@github.com:iuap-design/kero-adapter.git
			// git@github.com:iuap-design/kero.git
			// git@github.com:iuap-design/neoui.git
		},

		/**
		 * 删除neoui & kero-adapter仓库的输出文件
		 * 删除目前会引发neoui的npm run product错误
		 */
		// del: function() {
		// 	fse.emptyDirSync('./neoui/dist');
		// 	fse.emptyDirSync('./kero-adapter/node_modules/neoui/dist');
		// 	fse.emptyDirSync('./kero-adapter/dist');
		// },

		/**
		 * 复制拷贝各仓库js文件到kero-adapter下
		 */
		copy: function(copyname){
			var paths = fs.readdirSync(envPath);

			var loopFun = function(paths) {

				paths.forEach(function(path){
					// 此处路径不能使用__dirname,会指向插件的路径
					var _path = envPath + '/' + path + '/node_modules';
					var nextMod = path + '/node_modules';
					// console.log(_path);

					// 判断子集nodemodules是否存在
					if(fs.existsSync(_path)){

						var st = fs.statSync(_path);
						
						if(st.isDirectory()){
							// 存在
							var subpaths = fs.readdirSync(_path);
							subpaths.forEach(function(subpath) {
								// console.log(subpath);
								try {
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
		},

		/**
		 * neoui仓库增加输出u.css并复制到kero-adapter/node_modules/neoui/dist中
		 */
		ucss: function(){
			const uiDir = envPath + '/neoui';
			const cssCMD = `cd ${uiDir} && npm run product && cd ..`;
			execSync(cssCMD);
			const neoDir = './neoui/dist/';
			const neoModuleDir = './kero-adapter/node_modules/neoui/dist/';
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
			var command = `cd ${adapterPath} && npm run product`;
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