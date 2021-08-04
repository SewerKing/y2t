# Y2T

> Yapi 生成 Typescript`请求方法`及`声明文件`工具

## 插件使用

### 概念说明

根据 yapi 的层级划分，可以分为以下三个概念：

`分组`：可以理解为业务线，例如公司下的部门A，部门B，部门C等等…

`项目`：可以理解为后端的微服务，例如 部门A下的`营销` 下面会分为 `market_api`、`admin_api`、`wechat_api`等…

`模块`：可以理解为某个服务中的业务模块，例如 `营销`下面`market_api`服务的`周年庆活动`

层级关系：`分组` → `项目` → `模块`

y2t支持的细粒度在`模块`这一层，只能针对模块进行生成

### 功能入口

插件安装完成后，会在 Vs Code 底部工具栏新增`Work`、`Y2T`、`Y2T-DIFF`按钮

![Snipaste_2021-08-04_16-07-56](https://wynne-typora.oss-cn-beijing.aliyuncs.com/typora/Snipaste_2021-08-04_16-07-56.png)

### 工作区划分 Work

考虑到各人开发习惯不同，当使用多工作区开发时可以通过`Work`选择你需要生成的工作区

### 生成配置文件

首次打开工具栏中的`Y2T`按钮会提示没有`配置文件`，可以选择默认生成，会在项目中生成`ygt.config.js`文件

### 接口生成 Y2T

配置好`ygt.config.js`后，再次点击`Y2T`按钮。顶部会出现弹窗以此选择需要生成的`分组`，`项目`，`模块`既可。

![image-20210804160939489](https://wynne-typora.oss-cn-beijing.aliyuncs.com/typora/image-20210804160939489.png)

### 接口 Y2T-DIFF

生成 `api` 完毕后`y2t`会在`vscode`中基于`workspace`储存缓存, 点击`Y2T-DIFF`按钮，弹出`检测API是否更新`与`清除API工作区缓存`

``检测API是否更新`：可以进行检测 api 接口是否有更新, 如果有的话会进行询问，按照个人需求选择更新与否

`清除API工作区缓存`：则可以进行清除缓存，主要用于本地缓存紊乱时的状态恢复

![image-20210804161024614](https://wynne-typora.oss-cn-beijing.aliyuncs.com/typora/image-20210804161024614.png)



## 配置文件

工具默认会去寻找当前工作区的`ygt.config.js`文件，该文件默认导出一个对象

### 配置示例

```
module.exports = {
  // 账号
  account: 'xxx@xxx.cn',
  // 密码
  password: 'xxxxxx',
  // Yapi网址链接
  originUrl: 'https://yapi.xxxx.cn',
  // 请求声明模块
  fetchModule: 'import { AxiosPromise as RequestPromise , AxiosRequestConfig as RequestConfig } from "axios";',
  // 输出目录
  outDir: './src/apis',
  // 项目跟请求方法映射
  projectMapping: {
  	// 项目跟请求方法映射（projectId为生成目录id）
  	// 参考url https://yapi.xxxx.cn/project/216/interface/api
  	// 其中216就是projectId,当未配置时y2t也会有相应的projectId提示
    216: {
      exportName: 'API',
      // 返回报文泛式
      // wrapper: '{ code: string, message: string, data: T }',
    },
  },
  // 请求体实例文件路径
  requestFilePath: 'src/apis/',
  // 忽略ts校验
  tsIgnore: true,
  // 忽略eslint
  esLintIgnore: true,
};

```

### 配置具体说明

* `account`：账号，这里不使用yapi的token主要有两个原因：
  1. 为了能够根据账号进行yapi的权限区分
  2. token只能获取到`项目`级别，无法进行分组级别的筛选
* `password`：密码
* `originUrl`：Yapi 网址地址
* `outDir`：输出目录，相对于当前工作区的根目录
* `fetchModule`：请求方法声明模块，这里主要是防止对`axios`进行了二次封装的场景下可以正确定义
* `projectMapping`：项目映射。在微服务盛行的现在一个工程中可能会有多个 api 地址，所以这里按照`项目id`进行了请求方法映射。
  * `projectId`：项目 ID，例如url:https://xxx.xxx.com/project/216/interface/api，其中216即为项目ID
  * `exportName`：请求方法名称，为了兼容不同的请求库，所以生成的代码中不会直接生成 ajax 请求方法，需要外部传入，这里的`exportName`一般就是你配置好了的`axios`实例
  * `wrapper`：默认的返回体，如果接口有默认的返回包体时，可以通过`wrapper`定义 response，其中`T`代表返回的具体 data
* `requestFilePath`：请求方法的文件路径，也就是封装`axios`请求方法的文件路径，这里最好使用`@`别名或者`src`等相对路径
* `tsIgnore`：是否开启`tslint`忽略
* `esLintIgnore`：是否开启`esLintIgnore`忽略

