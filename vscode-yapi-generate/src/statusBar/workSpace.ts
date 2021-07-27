import { window, commands, StatusBarItem, StatusBarAlignment } from 'vscode'
import { state } from '../store'
import { WorkspaceCommandType } from '../enums'
import { getWorkSpacePath } from '../utils'

/**
 * statusBar实例
 */
let statusBar!: StatusBarItem

/**
 * statusBar注册command-Key
 */
const statusBarCommand = WorkspaceCommandType.getWorkSpace

/**
 * @Author: BEN
 * @Date: 2021-07-02 18:41:13
 * @Description: 初始化工作空间状态栏
 */
export const initWorkSpaceStatusBar = async () => {
  if (!statusBar) {
    statusBar = window.createStatusBarItem(StatusBarAlignment.Left)
  }
  const workspacePick = await getWorkSpacePath(true)
  initStatusBarText(workspacePick)
  await registerStatusCommands(statusBarCommand)
  statusBar.command = statusBarCommand
  statusBar.show()
}

/**
 * @Author: BEN
 * @Date: 2021-04-13 19:54:55
 * @Description: 注册快捷拉取选项
 */
const registerStatusCommands = async (key: typeof statusBarCommand) => {
  const commandList = await commands.getCommands(true)
  // 如果已经注册了command Key则不再进行注册
  if (commandList.includes(key)) return false
  // 加载工作空间选项
  const toggleWorkSpace = commands.registerCommand(key, async () => {
    const workspacePick = await getWorkSpacePath()
    initStatusBarText(workspacePick)
  })
  state.context.subscriptions.push(toggleWorkSpace)
}

/**
 * @Author: BEN
 * @Date: 2021-04-21 16:35:03
 * @Description: 修改状态栏label
 */
const initStatusBarText = (workspacePick?: WorkSpaceQuickPick) => {
  if (!workspacePick) return
  statusBar.text = `Work:${workspacePick.name}`
  state.workspacePath = workspacePick.uri
}

/**
 * @Author: BEN
 * @Date: 2021-04-13 19:55:05
 * @Description: 销毁状态栏
 */
export const disposeWorkSpaceStatusBar = () => statusBar?.dispose()
