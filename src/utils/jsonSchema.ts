import { compile } from 'json-schema-to-typescript'

// json schema生成声明文件
export async function jsonSchemaToDts (jsonSchema: any, name: string): Promise<string> {
  recursionRename(jsonSchema, name)
  return new Promise((resolve) => {
    jsonSchema.title = name
    compile(jsonSchema, name, {
      unknownAny: false,
      bannerComment: '',
      ignoreMinAndMaxItems: false,
      unreachableDefinitions: true
    }).then(dts => {
      resolve(dts)
    }).catch(err => {
      throw new Error(`json schema转声明文件失败：${err.toString()}`)
    })
  })
}

/**
 * @description 递归json schema修改名字
 * @author Wynne
 * @date 2021-07-21
 * @param properties
 */
function recursionRename (properties: any, prefix: string) {
  if (properties.properties) {
    recursionRename(properties.properties, prefix)
  }
  if (properties.items) {
    recursionRename(properties.items, prefix)
  }
  for (const key in properties) {
    const item = properties[key]
    if (item.properties) {
      recursionRename(item.properties, prefix)
    }
    if (item.items) {
      recursionRename(item.items, prefix)
    }
    if (item.title) {
      item.title = `${prefix}${item.title}`
      item.$$ref = `#/definitions/${item.title}`
    }
  }
  if (properties.title) {
    properties.title = `${prefix}${properties.title}`
    properties.$$ref = `#/definitions/${properties.title}`
  }
  if (properties.items?.title) {
    properties.items.title = `${prefix}${properties.items.title}`
    properties.items.$$ref = `#/definitions/${properties.items.title}`
  }
}
