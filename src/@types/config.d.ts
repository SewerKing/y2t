// 项目映射
interface IProjectMapping {
  // api方法
  exportName: string,
  // 通用封装
  wrapper: string
}

// 配置文件
interface IConfig {
  // 账号
  account: string,
  // 密码
  password: string,
  // 原地址
  originUrl: string,
  // 输出目录
  outDir: string,
  // 请求声明模块
  fetchModule: string,
  // 项目跟请求方法映射
  projectMapping: { [key: number]: IProjectMapping },
  // 请求文件路径
  requestFilePath: string,
  // 忽略ts校验
  tsIgnore: boolean,
  // 忽略eslint
  esLintIgnore: boolean
}

// 列表信息
interface IListItem {
  name: string,
  id: number
  basepath: string,
}

// diff的数据
interface IDiffInfo {
  id: number,
  title: string,
  url: string
}

// 接口缓存数据
interface IApiCache {
  // 接口ID
  id: number;
  // 更新时间
  updateTime: number;
  // 模块ID
  modularId: number;
  // 模块名称
  modularName: string;
  // 项目名
  projectName: string;
  // 项目ID
  projectId: number;
  // basePath
  basePath: string;
  // 当前项目路径
  cwd?: string;
}

// 接口更新返回参数
interface IDiffUpdateResponse {
  list: IApiInfoList[],
  projectName: string,
  projectId: number
}
