import Nedb from 'nedb'
import path from 'path'
import fs from 'fs'

/**
 * @description 获取数据库客户端
 * @author Wynne
 * @date 2021-07-02
 * @return {*}
 */
function getDBClient () {
  const filePath = path.resolve(__dirname, './data')
  const fileName = path.join(filePath, '/save.db')
  // 判断路径是否存在，不存在则创建
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath)
  }
  // 新建db客户端
  const db = new Nedb({
    filename: fileName,
    autoload: true
  })
  return db
}

/**
 * @description 更新数据库
 * @author Wynne
 * @date 2021-07-02
 * @export
 * @param data
 * @return {*}
 */
export async function updateDB (data: IApiInfoList[], projectName: string, projectId: number): Promise<void> {
  let apiList: IApiCache[] = []
  apiList = data.reduce((pre: IApiCache[], curr: IApiInfoList) => {
    const list = curr.list.map(item => {
      const cache: IApiCache = {
        id: item.id,
        updateTime: item.detail.updateTime,
        modularId: curr.modularId,
        modularName: curr.modularName,
        projectName: projectName,
        projectId: projectId,
        basePath: curr.basePath,
        cwd: process.cwd()
      }
      return cache
    })
    pre.push(...list)
    return pre
  }, apiList)
  return new Promise(async (resolve, reject) => {
    // 获取DB客户端
    const db = getDBClient()
    db.find({
      id: {
        $in: apiList.map(c => c.id)
      },
      cwd: process.cwd()
    }).exec((err: any, ret: IApiCache[]) => {
      if (err) reject(err)
      // 新增数据
      const insertList: IApiCache[] = apiList.filter(e => !ret.some(c => c.id === e.id))
      // 修改数据
      const updateList: IApiCache[] = apiList.filter(e => ret.some(c => c.id === e.id))
      // 如果有新增的数据
      if (insertList.length > 0) {
        db.insert(insertList, (err: any) => {
          if (err) console.log('err:', err)
        })
      }
      // 如果有新增的数据
      for (const item of updateList) {
        db.update(
          {
            id: item.id
          },
          {
            $set: {
              updateTime: item.updateTime
            }
          },
          {},
          (err: any) => {
            if (err) console.log('nedb 更新失败:', err)
          })
      }
      resolve()
    })
  })
}

/**
 * @description 获取当前项目DB中的缓存数据
 * @author Wynne
 * @date 2021-07-02
 * @export
 * @return {*}
 */
export async function getDBCache (): Promise<IApiCache[]> {
  return new Promise((resolve, reject) => {
    const db = getDBClient()
    db.find({
      cwd: process.cwd()
    }).exec((err: any, ret: IApiCache[]) => {
      if (err) {
        reject(err)
      }
      resolve(ret)
    })
  })
}

/**
 * @description 移除缓存
 * @author Wynne
 * @date 2021-07-02
 * @export
 * @return {*}
 */
export async function removeDBCache (): Promise<number> {
  return new Promise((resolve, reject) => {
    const db = getDBClient()
    db.remove({ cwd: process.cwd() }, {},
      (err: any, ret: number) => {
        if (err) {
          reject(err)
        }
        resolve(ret)
      })
  })
}
