# utip

用于重构后项目修改测试，及自动发包，提交仓库功能

### 安装

```
$ npm install -g utip
```

注意：考虑下载速度问题，自动下载依赖包时用到了`cnpm`，需要全局安装`cnpm`

### 执行环境

安装后，在**仓库集的根目录**执行以下命令，如`utip build`

### 执行命令

```
$ utip build
$ utip temp
$ utip pppppublish
```

### 简化命令

```
$ utip b
$ utip t
```

* `utip pppppublish`命令用于发包，涉及到仓库提交，避免误操作，不提供简化命令

### 操作说明

1. **utip build | utip b**

* 初始化：如本地目录未下载完整仓库，会拉取仓库到本地
* 仓库更新：自动获取更新，合并以上项目的`release`分支
* 复制源码：自动复制所有源码及依赖到的相关文件，拷贝到到依赖库`node_modules`中
* 输出文件：自动在kero-adapter的`dist`目录输出最终的产出文件

2. **utip temp | utip t**

* `utip build`后可执行此命令，用于新项目初始化


* 建立模板文件夹：自动生成空白模板，导入最新输出文件(如u.js等)

3. **utip pppppublish**

用于自动修改版本号，完成`npm publish`发布

* 更改版本：自动更新源码库`package`的版本，采用小版本+1进行升级
* 更改依赖：自动更新各库在`package`的依赖版本
* 输出文件：自动在各仓库输出`dist`目录
* npm发布：自动发布最新版本到`npm`
* 提交仓库：自动提交远程仓库`release`分支


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

------

**`utip publish`**: 非发布人员，请勿使用此功能，会更改`package.json`中的版本号。

- 用于各仓库发布`npm publish`，介绍略。


### 注意事项

* 执行`tip build`，使用了`cnpm install`来下载依赖包
