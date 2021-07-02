import inquirer from 'inquirer'
import { Login } from '@/yapi/login'
import { clg } from '@/utils/console'
import { getApiList } from '@/yapi/api'
import { getGroupId } from '@/yapi/group'
import { generateDir } from '@/utils/file'
import { getModular } from '@/yapi/modular'
import { getProjectId } from '@/yapi/project'
import { generateInterface } from './interface'
import { generateDeclaration } from '@/generate/declaration'
import { initConfig, existConfig, getConfig } from '@/utils/config'
import path from 'path'
import { initAxios } from '@/utils/http'
import { updateDB } from '@/utils/nedb'

/**
 * @description 生成typescript文档
 * @author Wynne
 * @date 2021-06-25
 * @export
 * @return {*}
 */
export async function generateTypescript (): Promise<void> {
  // 判断是否有配置文件
  if (!existConfig()) {
    const res = await inquirer.prompt({
      type: 'confirm',
      message: '当前项目不存在config，是否生成默认配置',
      name: 'isGenerate',
      default: false
    })
    if (res.isGenerate) {
      initConfig()
      return
    } else {
      clg('red', '已取消生成默认配置，请完善配置后重试')
      return
    }
  }
  // 初始化请求方法
  initAxios()
  // 登录
  await Login()
  // 选择分组
  const groupId = await getGroupId()
  // 选择项目
  const { projectId, projectName } = await getProjectId(groupId)
  // 选择模块
  const modulars = await getModular(projectId)
  const apiInfos: IApiInfoList[] = []
  clg('yellow', '> yapi接口信息拉取中...')
  // 批量拉取接口信息
  for (const item of modulars) {
    apiInfos.push({
      list: await getApiList(item.modularId),
      modularId: item.modularId,
      modularName: item.modularName,
      basePath: item.basePath
    })
  }
  clg('yellow', '> yapi接口信息拉取成功')
  clg('yellow', '> 正在生成接口文件...')
  const config = getConfig()
  // 创建输出文件夹
  const outdir = path.resolve(config.outDir)
  generateDir(outdir)
  // 生成声明文件
  for (const item of apiInfos) {
    // 生成声明文件
    generateDeclaration(item.list, projectName, item.modularId)
    // 生成接口文件
    generateInterface(item.list, projectName, projectId, item.basePath, item.modularId)
  }
  // 更新缓存
  updateDB(apiInfos, projectName, projectId)
  clg('yellow', '> 接口生成成功')
}
