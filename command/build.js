const fs = require('fs');
const envPath = process.cwd();
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const fse = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');

// npm依赖
const npmDir = [
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
    'neoui-kero-mixin'
];

const rootList = {
    "tinper-sparrow": ["tinper-neoui", "kero", "neoui-kero", "compox", "compox-util", "kero-fetch", "neoui-kero-mixin", "tinper-moy"],
    "tinper-neoui": ["neoui-kero", "neoui-kero-mixin", "tinper-moy"],
    "kero": ["neoui-kero", "tinper-moy"],
    "kero-fetch": ["tinper-moy"],
    "compox": ["compox-util", "kero-fetch", "neoui-kero", "tinper-neoui", "tinper-moy"],
    "compox-util": ["tinper-moy"],
    "neoui-kero-mixin": ["neoui-kero", "tinper-moy"],
    "neoui-kero": ["tinper-moy"],
    "tinper-neoui-grid": ['tinper-moy'],
    "tinper-neoui-tree": ['tinper-moy'],
    "tinper-neoui-polyfill": ['tinper-moy']
};

const dirs = fs.readdirSync(envPath); // 输出当前目录下的目录名

module.exports = (options) => {
    var inputConfig = options || {};

    var buildFun = {

        init: function() {
            this.choose();
        },

				/**
         * 选择需要build的仓库
         */
        choose: function() {
            const oTHis = this;
            return inquirer.prompt([{
                type: 'checkbox',
                name: 'selectRepo',
                message: 'Please select :',
                choices: npmDir
            }]).then(function(answers) {
                oTHis.npmDirArr = answers.selectRepo;
                oTHis.runFun();
            });
        },

        runFun: function() {
            this.whole();
            console.log(chalk.green(`\n √ 已clone更新各仓库，准备清空dist目录`));

						for (var i = 0; i < this.npmDirArr.length; i++) {
								fse.emptyDirSync('./' + this.npmDirArr[i] + '/dist');
            }
            console.log(chalk.green(`\n √ 已清空dist目录，准备执行源码仓库输出`));

            for (var i = 0; i < this.npmDirArr.length; i++) {
                this.copy(this.npmDirArr[i]);
            }
            console.log(chalk.green(`\n √ 已执行源码仓库src目录复制`));
            for (var i = 0; i < this.npmDirArr.length; i++) {
                this.runutipbuild(this.npmDirArr[i]);
            }
            console.log(chalk.green(`\n √ 已执行源码仓库输出,产出最终dist`));

            this.dist();
            console.log(chalk.green(`\n √ 完成：neoui-kero已输出最新dist目录`));
        },

        /**
         * 判断依赖库是否下载完成
         * 如未下载，则下载本地仓库并使用npm install安装包
         */
        whole: function() {
            var oThis = this;
            // console.log(dirs);
            this.npmDirArr.forEach(function(name) {
                oThis.cloneFun(name);
            });
            this.cloneFun('tinper-moy');

            // git@github.com:iuap-design/sparrow.git
            // git@github.com:iuap-design/neoui-kero.git
            // git@github.com:iuap-design/kero.git
            // git@github.com:iuap-design/neoui.git
        },

        cloneFun: function(name) {
            var branch = inputConfig.branch || 'release';

            if (dirs.indexOf(name) == -1) {
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

            if (inputConfig.mode == 'local') {
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
        },

        /**
         * 复制拷贝各仓库依赖文件到对应的相依赖的文件下,以便于没有发布的依赖包测试
         */
        copy: function(copyname) {
            // 优化筛选，方便后期维护，使用switch.case
            switch (copyname) {
                case "tinper-sparrow":
                    rootList["tinper-sparrow"].forEach(function(element, index) {
                        fse.copySync(envPath + '/tinper-sparrow/src', envPath + '/' + element + '/node_modules/tinper-sparrow/src');
                    });
                    break;
                case "tinper-neoui":
                    rootList["tinper-neoui"].forEach(function(element, index) {
                        fse.copySync(envPath + '/tinper-neoui/src', envPath + '/' + element + '/node_modules/tinper-neoui/src');
                    });
                    break;
                case "kero":
                    rootList["kero"].forEach(function(element, index) {
                        fse.copySync(envPath + '/kero/src', envPath + '/' + element + '/node_modules/kero/src');
                    });
                    break;
                case "compox":
                    rootList["compox"].forEach(function(element, index) {
                        fse.copySync(envPath + '/compox/src', envPath + '/' + element + '/node_modules/compox/src');
                    });
                    break;
                case "compox-util":
                    rootList["compox-util"].forEach(function(element, index) {
                        fse.copySync(envPath + '/compox-util/src', envPath + '/' + element + '/node_modules/compox-util/src');
                    });
                    break;
                case "kero-fetch":
                    rootList["kero-fetch"].forEach(function(element, index) {
                        fse.copySync(envPath + '/kero-fetch/src', envPath + '/' + element + '/node_modules/kero-fetch/src');
                    });
                    break;
                case "neoui-kero-mixin":
                    rootList["neoui-kero-mixin"].forEach(function(element, index) {
                        fse.copySync(envPath + '/neoui-kero-mixin/src', envPath + '/' + element + '/node_modules/neoui-kero-mixin/src');
                    });
                    break;
                case "neoui-kero":
                    rootList["neoui-kero"].forEach(function(element, index) {
                        fse.copySync(envPath + '/neoui-kero/src', envPath + '/' + element + '/node_modules/neoui-kero/src');
                    });
                    break;
            }
        },

        runutipbuild: function(npmdir) {
            const uiDir = envPath + '/' + npmdir;
            const cssCMD = `cd ${uiDir} && npm run product && cd ..`;
            execSync(cssCMD);
        },

        /**
         * 输出u.js
         */
        dist: function() {
            this.copyDist();
            var adapterPath = path.join(envPath, "tinper-moy");
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
        },

        copyDist: function() {
            for (var i = 0; i < this.npmDirArr.length; i++) {
                fse.copySync(envPath + '/' + this.npmDirArr[i] + '/dist', envPath + '/tinper-moy/node_modules/' + this.npmDirArr[i] + '/dist');
            }
        }
    };

    buildFun.init();
};
