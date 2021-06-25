import { http } from "../utils/http";
import inquirer from "inquirer";

// 获取分组ID
export async function getGroupId() {
  // 拉取分组列表
  const groupRes = await http.get('/api/group/list');
  const groupList: IListItem[] = groupRes.data.data.map((e: any) => {
    return {
      name: e.group_name,
      id: e._id
    }
  })
  // 选择分组
  const promptList = [{
    type: 'list',
    message: '请选择要生成的分组:',
    name: 'name',
    choices: groupList.map((e) => e.name),
    pageSize: 20,
  }];
  const groupName = await inquirer.prompt(promptList);
  // 选择的分组ID
  const groupId = groupList.find((e) => e.name === groupName.name)?.id;
  if (!groupId) {
    throw new Error('选择的分组不存在');
  }
  return groupId;
}
