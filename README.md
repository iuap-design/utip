# utip

用于重构后项目修改测试，及更改依赖，自动发包功能

### 安装

```
$ npm install -g utip
```

### 执行环境

安装后，在仓库的根目录执行以下命令，如`utip build`

### 构建思路

utip通过执行`utip build`，会在当前目录下执行以下操作：

1. **初始化**：判断完整的依赖仓库是否已经存在于当前目录。如未存在，则通过`git clone`依次下载各仓库，并自动执行`npm install`安装各仓库的依赖包

   > 各仓库依赖关系，可以[查看这里](https://github.com/iuap-design/blog/blob/master/iuapdesign%E9%87%8D%E6%9E%84%E7%9B%AE%E5%BD%95%26%E8%A7%84%E5%88%92.md#输出测试流程)

2. **更新**：拉取最新分支内容，如各仓库已存在于当前目录，自动执行`git pull`并拉取`release`分支的更新到本地

   > 如有冲突，需要手动解决，所以要做好勤提交的习惯

3. **neoui输出\拷贝**：neoui仓库执行`npm run product`输出`u.css`，并复制到`kero-adapter/node_modules/neoui/dist`文件中，用于最后的输出时获取

4. **grid/tree/polyfill输出\拷贝**：grid/tree/polyfill仓库输出并拷贝到adapter相应依赖库的dist目录下

5. **js源码拷贝**：复制各仓库的`js`源码到依赖仓库的`node_modules`对应的仓库中

6. **最终输出**：在`kero-adapter`仓库中输出最终的`u.js`

7. `utip build`执行后，可选择执行`utip temp`,实现创建空白模板文件夹：

   空白模板:已导入所有输出文件，方便用于测试。

***
**`utip publish`**: 非发布人员，请勿使用此功能，会更改`package.json`中的版本号。

* 用于各仓库发布`npm publish`，介绍略。

### 安装后，可在shell执行以下命令

```
$ utip build
$ utip temp
$ utip publish
```

### 支持简化命令

```
$ utip b
$ utip t
$ utip p
```

### 操作说明

**utip build | utip b**

* 初始化：如本地目录未下载完整仓库:`sparrow`,`neoui`,`kero`,`kero-adapter`，会拉取仓库到本地
* 仓库更新：自动获取更新，合并以上项目的`release`分支
* 复制源码：自动复制所有源码`js`到依赖库`node_modules`中
* 输出文件：自动在kero-adapter的`dist`目录中生成最新`u.js`文件

**utip temp | utip t**

* 建立空白模板用于测试：完成`utip build`后，可通过执行此命令，获取空白模板用于测试。

**utip publish | utip p**

用于自动修改版本号，完成`npm publish`发布

* 更改版本：自动更新源码库`package`的版本，采用小版本+1进行升级
* 更改依赖：自动更新各库在`package`的依赖版本
* 输出文件：自动在各仓库输出`dist`目录
* npm发布：自动发布最新版本到`npm`



### 注意事项

* 执行 `tip publish`，因存在冲突的风险，不会将仓库git提交远程，此部分功能需要确认需求再进行添加
* 执行`tip build`，使用了`cnpm install`来下载依赖包
