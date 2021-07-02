import { compile } from 'json-schema-to-typescript'

// json schema生成声明文件
export async function jsonSchemaToDts (jsonSchema: any, name: string): Promise<string> {
  return new Promise((resolve) => {
    jsonSchema.title = name
    compile(jsonSchema, name, {
      unknownAny: false,
      bannerComment: ''
    }).then(dts => {
      resolve(dts)
    }).catch(err => {
      throw new Error(`json schema转声明文件失败：${err.toString()}`)
    })
  })
}
