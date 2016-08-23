'use strict'

const fs = require('fs');
const envPath = process.cwd();
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;
const chalk = require('chalk');
const fse = require('fs-extra');
const co = require('co');
const prompt = require('co-prompt');

const tempPath = 'uapp';
const dirs = fs.readdirSync(envPath); // 输出当前目录下的目录名

module.exports = () => {

	var tempFun = {
		init: function() {
			this.sketch();
		},

		/**
		 * 查找usketch目录
		 */
		sketch: function() {
			var tplName = 'utest';
			co(function *() {
				let inputName = yield prompt('测试文件夹名称(如输入为空会在本地创建"utest"):');
				if(inputName != ''){
					tplName = inputName;
				}

				// 创建目录
				var command;
				if(dirs.indexOf('tplName') == -1) {
					command = `mkdir ${tplName} && cd ${tplName} && touch index.html && cd .. && cp -R kero-adapter/dist/ ${tplName}`;
				} else {
					console.log(chalk.red(`本地已创建${tplName}目录，请确认是否已创建过或重新创建新的测试文件夹`));
					return;
				}
				execSync(command);
				console.log(chalk.green(`\n √ 已在当前根目录创建 ${tplName}`));

				// 写入内容
				var data;
				data = ['<!DOCTYPE html>',
					'<html>',
					'<head>',
					'<meta charset="utf-8">',
					'<title>iuap-design</title>',
					'<!-- iuap design style start-->',
					'<link rel="stylesheet" type="text/css" href="./css/font-awesome.css">',
					'<link rel="stylesheet" type="text/css" href="./css/u.css">',
					'<!-- iuap design style end-->',
					'<style type="text/css">',
					'html, body {',
					'	height: 100%;',
					'	background: #eee;',
					'}',
					'.wrap {',
					'	text-align: center;',
					'	width: 100%;',
					'	height: 100%;',
					'	display: table;',
					'}',
					'.cont {',
					'	display: table-cell;',
					'	vertical-align: middle;',
					'	text-align: center;',
					'}',
					'.cont img {',
					'	width: 150px;',
					'}',
					'.cont h1 {',
					'	font-size: 24px;',
					'	color: #444;',
					'	line-height: 1.7;',
					'	font-weight: normal;',
					'	font-family: "HanHei SC", "PingHei", "PingFang SC", "STHeitiSC-Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;',
					'}',
					'</style>',
					'</head>',
					'<body>',
					'<!-- welcome -->',
					'<div class="wrap">',
					'<div class="cont">',
					'<img src="data:image/png;base64,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"alt=""><br>',
					'<h1>Hello <span>iUAP Design!</span></h1> ',
					'</div>',
					'</div>',
					'<!-- content start-->',
					'<!-- content end -->',
					'<script src="http://design.yyuap.com/static/jquery/jquery-1.9.1.min.js"></script>',
					'<!-- iuap desigin js start-->',
					'<script src="./js/u.js"></script>',
					'<!-- iuap desigin js end-->',
					'</body>',
					'</html>'].join("\n");
				
				fs.writeFileSync(`${envPath}/${tplName}/index.html`, data);

				process.exit();

			});
		}
	};

	tempFun.init();

};