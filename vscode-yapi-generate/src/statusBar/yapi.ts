import { window, commands, StatusBarItem, StatusBarAlignment } from 'vscode'
import {
  zhCN2EN,
  initAxios,
  Login,
  getGroupList,
  getProjectList,
  getModularList,
  getApiList,
  generateDeclaration,
  generateInterface
} from 'y2t'
import { state } from '../store'
import { YapiStatusBarCommandType, YapiStatusBarText, MenuEnums } from '../enums'
import { getWorkSpaceY2tConfig, handleYapiListToQuickMenu } from '../utils'
import { createProgressView } from '../utils/progress'
import { setApiCache } from '../utils/apiCache'

/**
 * statusBar实例
 */
let statusBar!: StatusBarItem

/**
 * statusBar注册command-Key
 */
let statusBarCommand = YapiStatusBarCommandType.getQuickPick

/**
 * @Author: BEN
 * @Date: 2021-04-13 19:53:11
 * @Description: 初始化Yapi状态栏
 */
export const initYapiStatusBar = async () => {
  if (!statusBar) {
    statusBar = window.createStatusBarItem(StatusBarAlignment.Left)
  }
  // 当前没有工作空间
  if (!state.workspacePath) return

  // 进行yapi登录 初始化状态栏
  try {
    statusBar.text = YapiStatusBarText.getQuickPick
    await registerStatusCommands(statusBarCommand)
    statusBar.command = statusBarCommand
    statusBar.show()
  } catch (error) {
    console.log('初始化Yapi状态栏失败:', error)
  }
}

/**
 * @Author: BEN
 * @Date: 2021-04-13 19:54:55
 * @Description: 注册快捷拉取选项
 */
const registerStatusCommands = async (key: YapiStatusBarCommandType) => {
  const commandList = await commands.getCommands(true)
  // 如果已经注册了command Key则不再进行注册
  if (commandList.includes(key)) return
  // 初始化生成状态栏按钮
  const initYapiStatusBtn = commands.registerCommand(key, async () => {
    try {
      // 获取配置
      getWorkSpaceY2tConfig()
      // 初始化axios
      initAxios()
      // 进行登录
      await Login()
      // 拉取分组
      const groupMenuItem = await fetchYapiMenus(MenuEnums.group)
      handlePickMenus(groupMenuItem.type, groupMenuItem?.menu)
    } catch (error) {
      const message = error.message ?? error
      window.showErrorMessage(message)
      console.error(`Yapi状态栏失败: ${error}`)
    }
  })
  state.context.subscriptions.push(initYapiStatusBtn)
}

/**
 * @Author: BEN
 * @Date: 2021-07-13 15:45:49
 * @Description: 获取yapi菜单
 */
const fetchYapiMenus = async (type: MenuEnums, id?: number) => {
  if (type === MenuEnums.group) {
    const groupList = await getGroupList()
    const menu = await window.showQuickPick(handleYapiListToQuickMenu(type, groupList))
    return { type, menu }
  }
  if (!id) return { type, menu: undefined }
  if (type === MenuEnums.project) {
    const projectList = await getProjectList(id)
    const menu = await window.showQuickPick(handleYapiListToQuickMenu(type, projectList))
    return { type, menu }
  }
  const { modularList } = await getModularList(id)
  const modularMenus = await window.showQuickPick(handleYapiListToQuickMenu(type, modularList), {
    canPickMany: true
  })
  return { type, menu: modularMenus }
}

/**
 * @Author: BEN
 * @Date: 2021-07-13 17:20:37
 * @Description: 整合菜单
 */
const handlePickMenus = async (type: MenuEnums, menu?: QuickMenuItem | QuickMenuItem[]) => {
  // 未选择菜单选项
  if (menu === undefined) return
  // 选择分组或项目
  if (!Array.isArray(menu)) {
    const { id } = menu
    // 记录项目名称、基础请求路径 方便后续生成文件
    if (type === MenuEnums.project) {
      const label = await zhCN2EN(menu.label)
      state.projectInfo = {
        ...menu,
        label
      }
    }
    // 返回上一层菜单
    if (id === -1) {
      const parentMenuType = type - 1
      const menuItem = await fetchYapiMenus(parentMenuType)
      handlePickMenus(menuItem.type, menuItem.menu)
      return
    }
    // 选择获取子级菜单
    const childMenuType = type + 1
    const menuItem = await fetchYapiMenus(childMenuType, id)
    handlePickMenus(menuItem.type, menuItem.menu)
    return
  }
  // 进行拉取数据 生成文件
  handleGenerateFiles(menu)
}

/**
 * @Author: BEN
 * @Date: 2021-07-15 15:08:41
 * @Description: 生成文件逻辑
 */
const handleGenerateFiles = async (menu: QuickMenuItem[]) => {
  const { id: projectId, label: projectName, basepath } = state.projectInfo
  const progressView = createProgressView(`项目：${projectName} 开始生成api与声明文件`)
  progressView.show()
  // 已完成进度
  let count = 1
  // 已生成的接口数组
  const apis = []
  // 异步循环 拉取api详情
  for (const { id: modularId, label: modularName } of menu) {
    try {
      // 进度百分比
      const increment = (count / menu.length) * 100
      console.log('increment', increment)
      // 更新进度信息
      progressView.update(`(${count}/${menu.length})`, increment)
      // 调用生成文件函数
      const list = await generateFile(projectId, projectName, modularId, modularName, basepath)
      apis.push(...list)
      // 防止进度条溢出
      count < menu.length && count++
    } catch (error) {
      progressView.close()
      window.showErrorMessage(
        error.message || `项目：${projectName} 模块：${count}/${menu.length} 生成失败`
      )
      console.error(error)
      throw new Error(`项目：${projectName} 模块：${count}/${menu.length} 生成失败`)
    }
  }
  progressView.close()
  const errorApiIds = apis.filter((item) => !item.success).map((item) => item.id)
  const errorTips =
    errorApiIds.length > 0 ? `其中${errorApiIds.toString()}接口异常, 已默认使用any代替` : ''
  window.showInformationMessage(
    `项目：${projectName} 模块：${count}/${menu.length} 生成完毕 ${errorTips}`
  )
}

/**
 * @Author: BEN
 * @Date: 2021-07-20 11:04:21
 * @Description: 生成api文件
 */
export const generateFile = async (
  projectId: number,
  projectName: string,
  modularId: number,
  modularName: string,
  basepath: string
) => {
  // 获取api接口列表
  const list = await getApiList(modularId)
  // 生成文件
  await generateDeclaration(list, projectName, modularId)
  generateInterface(list, projectName, projectId, basepath, modularId)
  // 设置缓存
  setApiCache(projectId, projectName, modularId, modularName, basepath, list)
  return list
}

/**
 * @Author: BEN
 * @Date: 2021-04-13 19:55:05
 * @Description: 销毁状态栏
 */
export const disposeYapiStatusBar = () => statusBar?.dispose()
