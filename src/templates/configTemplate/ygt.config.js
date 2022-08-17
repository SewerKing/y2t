module.exports = {
  // 账号
  account: 'xxxxxx@xxx.cn',
  // 密码
  password: 'xxxxxx',
  // 是否是ldap账号
  ldap: false,
  // Yapi网址链接
  originUrl: 'https://yapi.xxx.cn/',
  // 请求声明模块
  fetchModule: 'import { AxiosPromise as RequestPromise , AxiosRequestConfig as RequestConfig } from "axios";',
  // 输出目录
  outDir: './src/apis',
  // 项目跟请求方法映射
  projectMapping: {
    101: {
      exportName: 'marketApi',
      // 返回报文泛式
      wrapper: '{ code: string, message: string, data: T }',
    },
    102: {
      exportName: 'wechatApi',
    },
  },
  // 请求体实例文件路径
  requestFilePath: 'src/utils/http',
  // 忽略ts校验
  tsIgnore: true,
  // 忽略eslint
  esLintIgnore: true
};
