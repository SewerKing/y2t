import axios from 'axios';
import { getConfig } from './config';


/**
 * @description 初始化请求default，防止修改config文件目录
 * @author Wynne
 * @date 2021-07-02
 * @export
 */
export function initAxios() {
  const config = getConfig();
  axios.defaults.baseURL = config.originUrl;
}

/**
 * @description 设置cookie
 * @author Wynne
 * @date 2021-06-25
 * @export
 * @param cookie
 */
export function setCookie(cookie: string) {
  axios.interceptors.request.use((req) => {
    req.headers = {
      ...req.headers,
      cookie: cookie
    }
    return req;
  })
}

export const http = axios;