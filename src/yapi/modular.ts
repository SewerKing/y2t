import { http } from "@/utils/http";
import inquirer, { QuestionCollection } from "inquirer";

/**
 * @description 获取模块列表
 * @author Wynne
 * @date 2021-07-02
 * @export
 * @param projectId
 * @return {*} 
 */
export async function getModularList(projectId: number): Promise<IModularLiatResponse> {
  return new Promise((resolve) => {
    // 拉取菜单列表
    http.get('/api/project/get', {
      params: {
        id: projectId
      }
    }).then(async modularReq => {
      // 抽取关键数据
      const modularList: IListItem[] = modularReq?.data?.data?.cat?.map((e: any) => {
        return {
          name: e.name,
          id: e._id
        }
      }) || [];
      // 判断数据是否为空
      if (modularList.length === 0) {
        throw new Error(`当前暂无模块列表`);
      }
      resolve({
        modularList: modularList,
        basePath: modularReq?.data?.data?.basepath
      });
    }).catch(err => {
      throw new Error(`yapi拉取模块列表失败：${err.toString()}`)
    })
  })
}

// 获取菜单ID
export async function getModular(projectId: number): Promise<IModularResponse[]> {
  return new Promise(async (resolve) => {
    const modularList = await getModularList(projectId);
    // 选择菜单
    const promptList: QuestionCollection = [{
      type: "checkbox",
      message: '请选择要生成的模块:',
      name: 'modularNames',
      choices: modularList.modularList.map(e => e.name),
      pageSize: 100
    }];
    const { modularNames } = await inquirer.prompt(promptList);
    // 获取选择的模块
    const modulars = modularList.modularList.filter(e => modularNames.includes(e.name));
    if (!modulars) {
      throw new Error('选择的模块不存在');
    }
    const result: IModularResponse[] = [];
    for (const item of modulars) {
      result.push({
        modularId: item.id,
        modularName: item.name,
        basePath: modularList.basePath
      })
    }
    resolve(result);
  })
}