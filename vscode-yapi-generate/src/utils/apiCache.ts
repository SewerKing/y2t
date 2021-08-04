import { IApiInfoResponse, IApiInfoList } from 'y2t/lib/core/src/typing/yapi'
import { state } from '../store'
import { CACHE_KEY } from '../const'

/**
 * api缓存类型声明
 */
export interface WorkStateApiCache {
  list: IApiInfoList[]
  projectId: number
  projectName: string
}

/**
 * @Author: BEN
 * @Date: 2021-05-08 16:36:39
 * @Description: 获取api接口缓存
 */
export function getApiCache(modularId?: number) {
  const cacheJsonString: string | undefined = state.context.workspaceState.get(CACHE_KEY)
  // 如果没有缓存直接返回undefined
  if (!cacheJsonString) return undefined
  // 转换为map对象
  const cacheMap = JsonStringToMap(cacheJsonString)
  // 如果转换的map对象没有数据存储返回undefined
  if (!cacheMap.size || (modularId && !cacheMap.has(modularId))) return undefined
  // 如果未传输modularId直接返回缓存的map对象 否则返回对应id的数据
  return !modularId ? cacheMap : cacheMap.get(modularId)
}

/**
 * @Author: BEN
 * @Date: 2021-05-06 16:37:46
 * @Description: 设置api接口缓存
 */
export function setApiCache(
  projectId: number,
  projectName: string,
  modularId: number,
  modularName: string,
  basePath: string,
  list: IApiInfoResponse[]
) {
  const tempCache = getApiCache() as ApiCacheMap<WorkStateApiCache> | undefined
  // 查询本地是否含有缓存 没有则直接缓存 有则进行替换
  const cache: ApiCacheMap<WorkStateApiCache> =
    !tempCache || !tempCache.size ? new Map() : tempCache
  const apis: IApiInfoList[] = list.map(() => ({
    modularId,
    modularName,
    basePath,
    list
  }))
  cache.set(modularId, {
    projectId,
    projectName,
    list: apis
  })
  const cacheJsonString = MapToJsonStringify(cache)
  state.context.workspaceState.update(CACHE_KEY, cacheJsonString)
}

/**
 * @Author: BEN
 * @Date: 2021-06-04 14:32:53
 * @Description: 清除api接口缓存
 */
export function removeApiCache(modularId?: number) {
  // 没有传输modularId时直接清除全部缓存
  if (!modularId?.toString()) {
    return state.context.workspaceState.update(CACHE_KEY, undefined)
  }
  // 传输了modularId 只删除匹配modularId的缓存
  const cache = getApiCache() as ApiCacheMap<WorkStateApiCache>
  cache.delete(modularId)
  // 当缓存删除后为空时直接置空
  if (!cache || !cache.size) {
    return state.context.workspaceState.update(CACHE_KEY, undefined)
  }
  // map缓存转换为JsonStringify进行储存
  const cacheJsonString = MapToJsonStringify(cache)
  return state.context.workspaceState.update(CACHE_KEY, cacheJsonString)
}

/**
 * @Author: BEN
 * @Date: 2021-06-11 10:33:52
 * @Description: map转换json字符串
 */
function MapToJsonStringify(map: ApiCacheMap<WorkStateApiCache>) {
  const object = Object.create(null)
  for (const [key, value] of map) {
    object[key] = value
  }
  return JSON.stringify(object)
}

/**
 * @Author: BEN
 * @Date: 2021-06-11 11:35:10
 * @Description: json字符串转map
 */
function JsonStringToMap(jsonString: string) {
  const map = new Map() as ApiCacheMap<WorkStateApiCache>
  const object: ApiCacheJson<WorkStateApiCache> = JSON.parse(jsonString)
  for (const key of Object.keys(object)) {
    map.set(Number(key), object[Number(key)])
  }
  return map
}
