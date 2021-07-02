import { Login } from '@/yapi/login'
import { getGroupList } from '@/yapi/group'
import { getProjectList } from '@/yapi/project'
import { getModularList } from '@/yapi/modular'
import { generateInterface } from '@/generate/interface'
import { generateDeclaration } from '@/generate/declaration'
import { getUpdateList, generateUpdateInterface } from '@/generate/diff'
import { setConfigRootPath, generateDefaultConfig, existConfig } from '@/utils/config'
import { initAxios } from '@/utils/http'

export {
  // 设置配置文件根路径
  setConfigRootPath,
  // 初始化请求方法
  initAxios,
  // 判断是否有配置
  existConfig,
  // 生成默认配置
  generateDefaultConfig,
  // 登录
  Login,
  // 获取分组列表
  getGroupList,
  // 获取项目分组
  getProjectList,
  // 获取项目分组
  getModularList,
  // 生成声明文件
  generateDeclaration,
  // 生成接口文件
  generateInterface,
  // 获取需要更新的列表
  getUpdateList,
  // 生成更新的接口文件
  generateUpdateInterface
}
