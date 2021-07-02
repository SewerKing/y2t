// 项目返回信息
interface IProjectResponse {
  projectId: number;
  projectName: string;
}

// 模块返回信息
interface IModularResponse {
  modularId: number;
  basePath: string;
}

// 模块返回信息
interface IModularLiatResponse {
  modularList: IListItem[];
  basePath: string;
}

// api信息信息
interface IApiInfoList {
  list: IApiInfoResponse[];
  modularId: number;
  basePath: string;
}

// api信息返回信息
interface IApiInfoResponse {
  id: number,
  title: string,
  path: string,
  method: string,
  detail: IApiDetail
}

interface IApiDetailParam {
  desc: string,
  name: string,
  type: string,
  required: boolean
}

// API详细信息
interface IApiDetail {
  // 路径参数
  urlParams: IApiDetailParam[],
  // 请求参数
  query: IApiDetailParam[],
  // 请求体
  body: any,
  // 返回数据
  response: any,
  // 更新时间
  updateTime: number,
  // 接口名
  title: string,
  // 接口路径
  url: string
}