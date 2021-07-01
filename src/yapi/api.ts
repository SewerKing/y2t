import { http } from "@/utils/http";

// 获取api列表
export async function getApiList(modularId: number): Promise<IApiInfoResponse[]> {
  return new Promise((resolve) => {
    http.get('/api/interface/list_cat', {
      params: {
        page: 1,
        limit: 1000,
        catid: modularId
      }
    }).then(async apiReq => {
      const apiList: IApiInfoResponse[] = [];
      for (const item of apiReq?.data?.data?.list ?? []) {
        const detail = await getApiDetail(item._id);
        apiList.push({
          id: item._id,
          title: item.title,
          path: item.path,
          method: item.method,
          detail: detail
        })
      }
      resolve(apiList);
    }).catch(err => {
      throw new Error(`yapi拉取接口列表失败：${err.toString()}`)
    });
  })
}

// 获取api详情
async function getApiDetail(apiId: number): Promise<IApiDetail> {
  return new Promise((resolve) => {
    http.get('/api/interface/get', {
      params: {
        id: apiId
      }
    }).then(async apiReq => {
      const apiDetail = apiReq.data.data;
      let body = undefined;
      let response = undefined;
      // 解析Response
      try {
        response = apiDetail?.res_body ? JSON.parse(apiDetail.res_body) : undefined;
      } catch (err) {
        throw new Error(`\r\nResponse解析失败\r\n接口：${apiReq.data?.data?.path}\r\n请检查Yapi是否规范！\r\n`)
      }
      // 解析Body
      try {
        body = apiDetail?.req_body_other ? JSON.parse(apiDetail.req_body_other) : undefined;
      } catch (err) {
        throw new Error(`\r\nBody解析失败\r\n接口：${apiReq.data?.data?.path}\r\n请检查Yapi是否规范！\r\n`)
      }
      resolve({
        // 路径参数
        urlParams: apiDetail?.req_params?.map((e: any) => {
          return {
            desc: e.desc,
            name: e.name,
            type: 'string|number',
            required: true
          }
        }),
        // 请求参数
        query: apiDetail?.req_query?.map((e: any) => {
          return {
            name: e.name,
            type: 'string|number',
            desc: e.desc,
            required: e.required === '1' ? true : false
          }
        }),
        // 请求体
        body: body,
        // 返回数据
        response: response,
        // 更新时间
        updateTime: apiDetail?.up_time ?? 0,
        // 接口名
        title: apiDetail?.title ?? '',
        // 接口路径
        url: apiDetail?.path ?? ''
      })
    }).catch(err => {
      throw new Error(`yapi拉取接口详情失败：${err.toString()}`)
    });
  })
}