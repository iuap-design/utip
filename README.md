# utip

用于重构后项目修改测试，及更改依赖，自动发包功能

### 安装

```
$ npm install -g utip
```

### 安装后，可在shell执行以下命令

```
$ utip build
$ utip publish
```

### 支持简化命令

```
$ utip b
$ utip p
```

### 操作说明

**utip build | utip b**

* 初始化：如本地目录未下载完整仓库:`sparrow`,`neoui`,`kero`,`kero-adapter`，会拉取仓库到本地
* 仓库更新：自动获取更新，合并以上项目的`release`分支
* 复制源码：自动复制所有源码`js`到依赖库`node_modules`中
* 生成文件：自动在kero-adapter的`dist`目录中生成最新`u.js`文件

**utip publish | utip p**

用于自动修改版本号，完成`npm publish`发布

* 更改版本：自动更新源码库`package`的版本，采用小版本+1进行升级
* 更改依赖：自动更新各库在`package`的依赖版本
* npm发布：自动发布最新版本到`npm`

`tip publish`不会将仓库git提交远程，此部分功能需要确认需求再进行添加。

