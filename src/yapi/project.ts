import { http } from "@/utils/http";
import inquirer, { QuestionCollection } from "inquirer";
import { zhCN2EN } from "@/utils/name";


// 获取项目ID
export async function getProjectId(groupId: number): Promise<IProjectResponse> {
  return new Promise((resolve) => {
    // 拉取项目列表
    http.get('/api/project/list', {
      params: {
        group_id: groupId,
        page: 1,
        limit: 100
      }
    }).then(async projectReq => {
      // 抽取关键数据
      const projectList: IListItem[] = projectReq?.data?.data?.list?.map((e: any) => {
        return {
          name: e.name,
          id: e._id
        }
      }) || [];
      // 判断数据是否为空
      if (projectList.length === 0) {
        throw new Error(`当前暂无项目列表`);
      }
      // 选择分组
      const promptList: QuestionCollection = [{
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
      resolve({
        projectId: projectId,
        projectName: await zhCN2EN(projectName.name)
      });
    }).catch(err => {
      throw new Error(`yapi拉取项目列表失败：${err}`);
    })
  })
}