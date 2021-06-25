import { http } from "../utils/http";
import inquirer from "inquirer";
import { zhCN2EN } from "../utils/name";

// 获取项目ID
export async function getProjectId(groupId: string) {
  // 拉取项目列表
  const projectReq = await http.get('/api/project/list', {
    params: {
      group_id: parseInt(groupId),
      page: 1,
      limit: 100
    }
  })
  const projectList: IListItem[] = projectReq.data.data.list.map((e: any) => {
    return {
      name: e.name,
      id: e._id
    }
  })
  // 选择分组
  const promptList = [{
    type: 'list',
    message: '请选择要生成的项目:',
    name: 'name',
    choices: projectList.map(e => e.name),
    pageSize: 20
  }];
  const projectName = await inquirer.prompt(promptList);
  const project = projectList.find(e => e.name === projectName.name);
  // 选择的项目ID
  const projectId = project?.id;
  if (!projectId) {
    throw new Error('选择的项目不存在');
  }
  if (!projectId) {
    throw new Error('选择的项目不存在');
  }
  return {
    projectId: projectId,
    projectName: await zhCN2EN(projectName.name)
  };
}