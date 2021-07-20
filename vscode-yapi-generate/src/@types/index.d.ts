/**
 * 工作空间路径选择对象
 */
interface WorkSpaceQuickPick {
  index: number
  name: string
  uri: string
}

/**
 * 菜单选项对象
 */
interface QuickMenuItem {
  id: number
  label: string
  basepath: string
  detail?: string
  description?: string
}

/**
 * 普通菜单对象
 */
type MenuItem = Omit<QuickMenuItem, 'basepath'>

/**
 * 缓存Map对象
 */
type ApiCacheMap<T> = Map<number, T>

/**
 * 缓存Json字符串
 */
type ApiCacheJson<T> = {
  [key: number]: T
}
