import { compile } from 'json-schema-to-typescript'

// json schema生成声明文件
export async function jsonSchemaToDts (jsonSchema: any, name: string): Promise<string> {
  // 防止导出的对象重名，对子对象进行重命名
  recursionRename(jsonSchema, name)
  // 如果没有写入title的时候，填入默认title
  addDefaultTitle(jsonSchema.properties, name)
  return new Promise((resolve) => {
    jsonSchema.title = name
    compile(jsonSchema, name, {
      unknownAny: false,
      bannerComment: '',
      ignoreMinAndMaxItems: true,
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
 * @param schema
 */
function recursionRename (schema: any, prefix: string) {
  if (schema.properties) {
    recursionRename(schema.properties, prefix)
  }
  if (schema.items) {
    recursionRename(schema.items, prefix)
  }
  for (const key in schema) {
    const item = schema[key]
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
  if (schema.title) {
    schema.title = `${prefix}${schema.title}`
    schema.$$ref = `#/definitions/${schema.title}`
  }
  if (schema.items?.title) {
    schema.items.title = `${prefix}${schema.items.title}`
    schema.items.$$ref = `#/definitions/${schema.items.title}`
  }
}

/**
 * @description 给没有title的子对象添加title，方便生成不同的interface
 * @author Wynne
 * @date 2021-07-27
 * @param schema
 * @param prefix
 */
function addDefaultTitle (schema: any, prefix: string) {
  for (const key in schema) {
    const item = schema[key]
    const keyName = key[0].toLocaleUpperCase() + key.substring(1, key.length)
    if (item.properties && !item.title) {
      item.title = `${prefix}${keyName}`
      item.$$ref = `#/definitions/${prefix}${keyName}`
    }
    if (item.properties) {
      addDefaultTitle(item.properties, `${prefix}${keyName}`)
    }
    if (item.items) {
      if (!item.items.title) {
        item.items.title = `${prefix}${keyName}`
        item.items.$$ref = `#/definitions/${prefix}${keyName}`
      }
      addDefaultTitle(item.items, `${prefix}${keyName}`)
    }
  }
}
