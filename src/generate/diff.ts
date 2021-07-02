import path from "path";
import inquirer from "inquirer";
import { Login } from "@/yapi/login";
import { clg } from "@/utils/console";
import { initAxios } from "@/utils/http";
import { getConfig } from "@/utils/config";
import { generateDir } from "@/utils/file";
import { getDBCache, updateDB } from "@/utils/nedb";
import { getApiDetail, getApiList } from "@/yapi/api";
import { generateInterface } from "@/generate/interface";
import { generateDeclaration } from "@/generate/declaration";

/**
 * @description 获取更变接口列表
 * @author Wynne
 * @date 2021-07-02
 * @export
 */
export async function getUpdateList(localCaches: IApiCache[]): Promise<IApiCache[]> {
  return new Promise(async (resolve) => {
    let result: IApiCache[] = [];
    // 遍历缓存数组，对比最后更新时间
    for (const item of localCaches) {
      const detail = await getApiDetail(item.id);
      if (localCaches.some(e => e.id === item.id && e.updateTime !== detail.updateTime)) {
        result.push(item);
      }
    }
    // 根据模块ID去重
    result = result.reduce((pre: IApiCache[], curr: IApiCache) => {
      if (!pre.some(c => c.modularId === curr.modularId)) {
        pre.push(curr)
      }
      return pre;
    }, []);
    resolve(result)
  })
}

/**
 * @description 生成更新的接口文档
 * @author Wynne
 * @date 2021-07-02
 * @export
 * @param list
 */
export async function generateUpdateInterface(list: IApiCache[]): Promise<IDiffUpdateResponse[]> {
  // 获取参数
  const config = getConfig();
  const result: IDiffUpdateResponse[] = [];
  let apiInfos: IApiInfoList[] = []
  for (const item of list) {
    // 获取接口列表
    const apiList = await getApiList(item.modularId);
    // 生成输出文档
    const outdir = path.resolve(config.outDir)
    generateDir(outdir);
    // 生成声明文件
    generateDeclaration(apiList, item.projectName, item.modularId);
    // 生成接口文件
    generateInterface(apiList, item.projectName, item.projectId, item.basePath, item.modularId);
    // 添加到记录
    apiInfos = [{
      list: apiList,
      modularId: item.modularId,
      modularName: item.modularName,
      basePath: item.basePath
    }];
    result.push({
      list: apiInfos,
      projectName: item.projectName,
      projectId: item.projectId
    })
  }
  return result;
}

/**
 * @description 接口diff
 * @author Wynne
 * @date 2021-07-02
 * @export
 * @return {*} 
 */
export async function diffInterface() {
  // 初始化请求方法
  initAxios();
  // 登录
  await Login();
  // 获取当前项目缓存
  const caches = await getDBCache();
  if (!caches || caches.length === 0) {
    clg('yellow', '> 当前暂无接口缓存，请重新生成接口后恢复缓存');
    return;
  }
  // 获取更新的接口列表
  const updateList = await getUpdateList(caches);
  if (updateList && updateList.length === 0) {
    clg('green', '接口已经是最新版')
    return;
  }
  // 选择更新的模块
  const promptList = [{
    type: 'checkbox',
    message: '请选择要更新的模块:',
    name: 'modularNames',
    choices: updateList.map(e => e.modularName),
    pageSize: 100
  }];
  // 获取需要更新的模块
  const { modularNames } = await inquirer.prompt(promptList);
  // 选择的模块列表
  const selectModulars = updateList.filter(e => modularNames.includes(e.modularName))
  if (selectModulars.length === 0) {
    clg('green', '> 取消接口更新')
    return;
  }
  // 生成更新的接口文档
  const diffResult = await generateUpdateInterface(selectModulars);
  for (let item of diffResult) {
    // 更新API缓存
    updateDB(item.list, item.projectName, item.projectId);
  }
  console.log('> 接口更新完成')
}