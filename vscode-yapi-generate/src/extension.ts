import { ExtensionContext } from 'vscode'
import { state } from './store'
import { initWorkSpaceStatusBar, disposeWorkSpaceStatusBar } from './statusBar/workSpace'
import { initYapiStatusBar, disposeYapiStatusBar } from './statusBar/yapi'
import { initDiffStatusBar, disposeDiffStatusBar } from './statusBar/diff'

// 在第一次执行命令时，才会激活扩展程序。
// 当扩展程序被激活的时候，会调用此方法。
export async function activate(context: ExtensionContext) {
  // 将上下文储存至store
  state.context = context
  // 初始化切换工作空间状态栏
  await initWorkSpaceStatusBar()
  // 初始化生成器
  await initYapiStatusBar()
  // 初始化diff状态栏
  await initDiffStatusBar()
}

// 当扩展程序停用，调用此方法
export function deactivate() {
  disposeWorkSpaceStatusBar()
  disposeYapiStatusBar()
  disposeDiffStatusBar()
}
