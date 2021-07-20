import { DiffMenuEnums } from '../enums'

/**
 * diff菜单
 */
export const DIFF_MENU: MenuItem[] = [
  {
    id: DiffMenuEnums.diffApiCache,
    label: '检测API是否更新',
    detail: '生成API资源文件时，会自动注入API缓存到vscode workspace'
  },
  {
    id: DiffMenuEnums.clearApiCache,
    label: '清除API工作区缓存',
    detail: '清除API工作区缓存仅只清除vscode workspace中的缓存，并不会删除已生成的文件'
  }
]

/**
 * 缓存key值
 */
export const CACHE_KEY = 'Y2T_YAPI_CACHE'
