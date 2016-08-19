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
	'kero-adapter'
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
			console.log(chalk.green(`\n √ 仓库已clone更新，准备复制源码`));

			for(var i=0; i<npmDir.length; i++){
				this.copy(npmDir[i]);
			}
			console.log(chalk.green(`\n √ 复制已完成,准备输出dist目录`));
			this.dist();
			console.log(chalk.green(`\n √ 完成：已输出u.js`));
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
								  
								  // console.log('完成' + _path +'/'+ copyname +'/js' + "复制，success!")
								} catch (err) {
								  console.error(err)
								}
							});
							var nextModAry = [nextMod];
							// console.log(nextModAry)
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