module.exports = {
  // 账号
  account: 'chenweibin@codemao.cn',
  // 密码
  password: 'f8461973',
  // Yapi网址链接
  originUrl: 'https://interface.codemao.cn/',
  // 请求声明模块
  fetchModule: 'import { AxiosPromise as RequestPromise , AxiosRequestConfig as RequestConfig } from "axios";',
  // 输出目录
  outDir: './src/apis',
  // 项目跟请求方法映射
  projectMapping: {
    537: {
      exportName: 'crmApi',
      // 返回报文泛式
      wrapper: '{ code: string, message: string, data: T }',
    },
  },
  // 请求体实例文件路径
  requestFilePath: '../../utils/http',
  // 忽略ts校验
  tsIgnore: true,
  // 忽略eslint
  esLintIgnore: true
};
