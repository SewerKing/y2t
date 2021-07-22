import { window, commands, StatusBarItem, StatusBarAlignment } from 'vscode'
import { initAxios, Login, getCacheList, getUpdateList } from 'y2t'
import { IApiCache } from 'y2t/src/typing/yapi'
import { generateFile } from './yapi'
import { DiffCommandType, DiffStatusBarText, DiffMenuEnums } from '../enums'
import { DIFF_MENU } from '../const'
import { state } from '../store'
import { getWorkSpaceY2tConfig } from '../utils'
import { WorkStateApiCache, getApiCache, removeApiCache } from '../utils/apiCache'
import { createProgressView } from '../utils/progress'

/**
 * statusBar注册command-Key
 */
let statusBarCommand = DiffCommandType.DiffApi

/**
 * statusBar实例
 */
let statusBar!: StatusBarItem

/**
 * @Author: BEN
 * @Date: 2021-06-04 14:53:15
 * @Description: 初始化diff状态栏
 */
export const initDiffStatusBar = async () => {
  if (!statusBar) {
    statusBar = window.createStatusBarItem(StatusBarAlignment.Left)
  }
  statusBar.text = DiffStatusBarText.DiffApi
  await registerStatusCommands(statusBarCommand)
  statusBar.command = statusBarCommand
  statusBar.show()
}

/**
 * @Author: BEN
 * @Date: 2021-06-04 19:54:55
 * @Description: 注册快捷拉取选项
 */
const registerStatusCommands = async (key: DiffCommandType) => {
  const commandList = await commands.getCommands(true)
  // 如果已经注册了command Key则不再进行注册
  if (commandList.includes(key)) return false
  const initDiffStatusBtn = commands.registerCommand(key, async () => {
    const chooseMenu = await window.showQuickPick(DIFF_MENU)
    // 未选择菜单
    if (!chooseMenu) return
    handleRunTask(chooseMenu.id)
  })
  state.context.subscriptions.push(initDiffStatusBtn)
}

/**
 * @Author: BEN
 * @Date: 2021-07-19 19:25:51
 * @Description: 执行菜单任务
 */
const handleRunTask = async (id: DiffMenuEnums) => {
  // 获取配置
  getWorkSpaceY2tConfig()
  // 初始化axios
  initAxios()
  // 进行登录
  await Login()
  const task = {
    [DiffMenuEnums.diffApiCache]: () => handleDiffApi(),
    [DiffMenuEnums.clearApiCache]: () => {
      removeApiCache()
      window.showInformationMessage('已清除API全局缓存')
    }
  }
  task[id]()
}

/**
 * @Author: BEN
 * @Date: 2021-07-16 16:29:35
 * @Description: 处理diff逻辑
 */
const handleDiffApi = async () => {
  const apiCacheMap = getApiCache() as ApiCacheMap<WorkStateApiCache> | undefined
  if (!apiCacheMap || !apiCacheMap.size) {
    return window.showInformationMessage('API暂无缓存, 请先初始生成api文件')
  }
  const hasUpdateCaches: IApiCache[] = []
  for (const [_, val] of apiCacheMap) {
    const { projectId, projectName, list } = val
    const localCaches = getCacheList(list, projectName, projectId)
    hasUpdateCaches.push(...localCaches)
  }
  const progressView = createProgressView('检测Api是否含有更新')
  progressView.show()
  try {
    console.time()
    const data = await getUpdateList(hasUpdateCaches)
    console.timeEnd()
    progressView.close()
    if (!data || !data.length) {
      return window.showInformationMessage('API暂无更新')
    }
    window
      .showInformationMessage('检测到有API需要更新，是否进行更新', '是', '否')
      .then(async (text) => {
        if (text === '是') {
          const progressView = createProgressView('开始更新api与声明文件')
          progressView.show()
          // 已完成进度
          let count = 1
          // 已生成的接口数组
          const apis = []
          for (const cache of data) {
            const { projectId, projectName, modularId, modularName, basePath } = cache
            try {
              // 进度百分比
              const increment = parseInt(((count / data.length) * 100).toFixed(0));
              // 更新进度信息
              progressView.update(`(${count}/${data.length})`, increment)
              // 生成文件
              const list = await generateFile(
                projectId,
                projectName,
                modularId,
                modularName,
                basePath
              )
              apis.push(...list)
              // 防止进度条溢出
              count < data.length && count++
            } catch (error) {
              progressView.close()
              window.showErrorMessage(error.message || `api (${count}/${data.length}) 更新失败`)
              console.error(error)
              throw new Error(`api (${count}/${data.length}) 更新失败`)
            }
          }
          const errorApiIds = apis.filter((item) => !item.success).map((item) => item.id)
          const errorTips =
            errorApiIds.length > 0 ? `其中${errorApiIds.toString()}接口异常, 已默认使用any代替` : ''
          window.showInformationMessage(`模块：${count}/${data.length} 生成完毕 ${errorTips}`)
        }
      })
  } catch (error) {
    progressView.close()
    window.showErrorMessage(error.message || 'Api检测更新失败')
    console.error(error)
  }
}

/**
 * @Author: BEN
 * @Date: 2021-06-04 19:55:05
 * @Description: 销毁状态栏
 */
export const disposeDiffStatusBar = () => statusBar?.dispose()
