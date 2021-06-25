import { http } from './http'

/**
 * @description 下划线转驼峰
 * @author Wynne
 * @date 2021-06-25
 * @export
 * @param name
 * @param [isBigHump=false] 是否大驼峰
 * @return {*} 
 */
export function underlineToHump(name: string, isBigHump = false) {
  let hump = name.replace(/[\_|\-|\s](\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
  hump = (isBigHump ? hump.charAt(0).toLocaleUpperCase() : hump.charAt(0).toLocaleLowerCase()) + hump.substr(1);
  return hump;
}

/**
 * @description 中文转英文
 * @author Wynne
 * @date 2021-06-25
 * @export
 * @param text 翻译的文本
 * @return {*} 
 */
export function zhCN2EN(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (/[\u4e00-\u9fa5]/.test(text)) {
      const url = `http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=${encodeURIComponent(text)}`
      http.get(url).then(res => {
        resolve(underlineToHump(res.data.translateResult[0][0].tgt, true));
      }).catch(err => {
        console.log("有道翻译接口请求失败：", err)
        reject(err);
      })
    } else {
      resolve(underlineToHump(text, true));
    }
  })
}