import { ExtensionContext } from 'vscode'

interface State {
  context: ExtensionContext
  workspacePath: string
  projectInfo: QuickMenuItem
}

const state: State = {
  context: undefined as unknown as ExtensionContext,
  workspacePath: '',
  projectInfo: {
    id: 0,
    label: '',
    basepath: ''
  }
}

export { state }
