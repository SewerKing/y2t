import { workspace, window } from 'vscode'
import path from 'path'
import { setConfigRootPath, existConfig, getConfig, generateDefaultConfig } from 'y2t'
import { MenuEnums } from '../enums'
import { IListItem } from 'y2t/src/typing/yapi'
import { state } from '../store'

/**
 * @Author: BEN
 * @Date: 2021-04-19 16:35:22
 * @Description: 获取生成项目路径
 */
export const getWorkSpacePath = async (returnFirst = false) => {
  if (!workspace.workspaceFolders?.length) {
    window.showErrorMessage('当前没有工作空间')
    return void 0
  }
  const workspaceFolders: WorkSpaceQuickPick[] = workspace.workspaceFolders.map((item) => ({
    index: item.index,
    name: item.name,
    uri: item.uri.path
  }))
  // 当只有一个工作空间时直接输出当前路径 或 只返回第一个
  if (workspaceFolders.length === 1 || returnFirst) return workspaceFolders[0]
  // 多个工作空间时获取用户选择的路径
  const chooseFolder = await window.showWorkspaceFolderPick({
    placeHolder: state.workspacePath ? `当前工作空间：${state.workspacePath}` : '请选择工作空间'
  })
  if (!chooseFolder) return void 0
  return {
    index: chooseFolder.index,
    name: chooseFolder.name,
    uri: chooseFolder.uri.path
  }
}

/**
 * @Author: BEN
 * @Date: 2021-04-30 15:46:13
 * @Description: 获取工作空间配置，没有则会进行初始化生成
 */
export const getWorkSpaceY2tConfig = () => {
  // 获取工作空间路径
  const configPath = path.resolve(state.workspacePath)
  // 注册core配置路径
  setConfigRootPath(configPath)
  if (existConfig()) return handleGetConfig()
  window.showErrorMessage(`读取配置文件出错, 是否进行初始化配置文件?`, '是', '否').then((text) => {
    if (text === '是') {
      generateDefaultConfig()
      window.showInformationMessage('配置初始化成功')
      return handleGetConfig()
    }
  })
}

/**
 * @Author: BEN
 * @Date: 2021-07-09 18:19:33
 * @Description: 获取配置文件
 */
function handleGetConfig() {
  const config = getConfig()
  // 判断获取如果为string则为校验config文件内容失败
  if (typeof config === 'string') {
    window.showErrorMessage(config)
    throw new Error(config)
  }
  return config
}

/**
 * @Author: BEN
 * @Date: 2021-07-13 17:28:48
 * @Description: Yapi List转换为快捷菜单格式
 */
export function handleYapiListToQuickMenu(type: MenuEnums, list: IListItem[]) {
  const data: QuickMenuItem[] = list.map((item) => ({
    id: item.id,
    label: item.name,
    basepath: item.basepath
  }))
  if (type === MenuEnums.project) {
    // 添加返回上级菜单
    data.unshift({
      id: -1,
      label: '返回分组列表',
      detail: '当前：项目列表',
      basepath: ''
    })
  }
  return data
}
