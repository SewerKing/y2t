import { window, Progress, ProgressLocation } from 'vscode'

export function createProgressView (title?: string) {
  return new ProgressView(title)
}

class ProgressView {
  private _resolver: (value?: any) => void
  private _view: Progress<{ message?: string; increment?: number }>
  private _currentProgress: number
  private _currentText: string
  private _promise: Promise<void>

  constructor (readonly title?: string) {
    this._resolver = undefined as unknown as (value?: any) => void
    this._view = undefined as unknown as Progress<{ message?: string; increment?: number }>
    this._currentProgress = 0
    this._currentText = ''
    this._promise = undefined as unknown as Promise<void>
  }

  show () {
    window.withProgress(
      {
        cancellable: false,
        location: ProgressLocation.Notification,
        title: this.title
      },
      (progress) => {
        this._view = progress
        this._promise = new Promise((resolve) => (this._resolver = resolve))
        return this._promise
      }
    )
  }

  get text () {
    return this._currentText
  }

  get progress () {
    return this._currentProgress
  }

  update (message: string, increment: number) {
    this._currentProgress += increment
    this._currentText = message

    if (this._currentProgress < 0) {
      this._currentProgress = 0
    }

    this._view.report({ message, increment })
  }

  close () {
    this._resolver()
  }

  async wait () {
    return this._promise
  }
}
