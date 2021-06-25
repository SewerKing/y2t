# CYG

> Yapi 生成 Typescript`请求方法`及`声明文件`工具

## 安装使用

安装插件：[VisualStudio - Marketplace](https://marketplace.visualstudio.com/items?itemName=codemao.codemao-yapi-generate)，VSCode 最低版本要求：`^1.55.0`

## 插件使用

### 概念说明

根据目前公司 yapi 的层级划分，可以分为以下三个概念：

`分组`：可以理解为业务线，例如上课系统、营销、数字化、新零售、录播课等等…

`项目`：可以理解为后端的服务，例如 `营销` 下面会分为 `market_api`、`admin_api`、`wechatsbp_api`等…

`模块`：可以理解为某个服务中的业务模块，例如 `营销`下面`market_api`服务的`编程猫六周年庆活动`

层级关系：`分组` → `项目` → `模块`

### 功能入口

插件安装完成后，会在 Vs Code 底部工具栏新增`workSpace`、`CYG`、`CYG-DIFF`按钮

![image-20210603202003105](https://wynne-typora.oss-cn-beijing.aliyuncs.com/typora/image-20210603202003105.png)

### 工作区划分

考虑到各人开发习惯不同，当使用多工作区开发时可以通过`workSpace`选择你需要生成的工作区

### 生成配置文件

首次打开工具栏中的`CYG`按钮会提示没有`配置文件`，可以选择默认生成，会在项目中生成`ygt.config.js`文件

![image-20210603135327646](https://wynne-typora.oss-cn-beijing.aliyuncs.com/typora/image-20210603135327646.png)

### 接口生成

配置好`ygt.config.js`后，再次点击`CYG`按钮。顶部会出现弹窗以此选择需要生成的`分组`，`项目`，`模块`既可。

![image-20210603140237363](https://wynne-typora.oss-cn-beijing.aliyuncs.com/typora/image-20210603140237363.png)

### 接口 DIFF

生成 api 完毕后会在 vscode workspace 中储存缓存, 点击`CYG-DIFF`按钮，弹出`检测API是否更新`与` 清除API工作区缓存``检测API是否更新 `可以进行检测 api 接口是否含有更新, 如果有的话会进行询问，按照个人需求选择更新与否，`清除API工作区缓存`则可以进行清除缓存

## 配置文件

工具默认会去寻找当前工作区的`ygt.config.js`文件，该文件默认导出一个对象

配置示例：

```js
module.exports = {
  // 账号
  account: 'xxxxxx@codemao.cn',
  // 密码
  password: 'xxxxxx',
  // Yapi网址链接
  originUrl: 'https://yapi.xxxxxx.cn',
  // 声明模块
  dtsModule:
    "import { AxiosPromise as RequestPromise , AxiosRequestConfig as RequestConfig } from '@mlz/axios/node_modules/axios';",
  // 输出目录
  outDir: './src/apis',
  // 项目跟请求方法映射（projectId为生成目录id）
  // 参考url https://interface.codemao.cn/project/216/interface/api
  // 其中216即为projectId
  projectMapping: {
    projectId: {
      exportName: 'marketApi',
      wrapper: '{ errorCode:string, errorMsg:string, data: T }'
    },
    projectId2: {
      exportName: 'api'
    }
  },
  // 请求体实例文件路径
  requestFilePath: 'src/utils/http',
  // 输出语言
  target: 'typescript'
}
```

配置具体说明

| 字段            | 备注                                                                                                                 | 示例                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| account         | 账号，这里不使用 token 是为了能够根据账号进行 yapi 的权限区分。且 token 只能获取到`项目`级别，无法进行分组级别的筛选 |                                                                                                                  |
| password        | 密码                                                                                                                 |                                                                                                                  |
| originUrl       | Yapi 网址链接                                                                                                        | https://interface.codemao.cn                                                                                     |
| outDir          | 输出目录，相对于当前工作区的根目录                                                                                   | ./src/apis                                                                                                       |
| dtsModule       | 请求方法的声明模块                                                                                                   | "import { AxiosPromise as Promise , AxiosRequestConfig as RequestConfig } from '@mlz/axios/node_modules/axios';" |
| projectMapping  | 项目映射。因为我们一个工程中可能会有多个 api 地址，所以这里按照`项目id`进行了请求方法映射。                          |                                                                                                                  |
| - projectId     | 项目 ID，参考 url:https://interface.codemao.cn/project/216/interface/api，其中216即为项目ID                          | 216                                                                                                              |
| - exportName    | 请求方法名称，为了兼容不同的请求库，所以生成的代码中不会直接生成 ajax 请求方法，需要外部传入                         | marketApi                                                                                                        |
| - wrapper       | 默认的返回体，如果接口有默认的返回包体时，可以通过`wrapper`定义 response，其中`T`代表返回的具体 data                 | { code:string, msg:string, data: T }                                                                             |
| requestFilePath | 请求方法的文件路径，相对于配置中的`输出目录/项目API/index.ts`文件                                                    | src/utils/http                                                                                                   |
| target          | **暂为实现** 输出的语言，目前只支持 Typescript，后续计划支持 Javascript                                              | typescript                                                                                                       |
