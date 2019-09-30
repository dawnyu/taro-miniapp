import Taro from '@tarojs/taro'
import request from './base'

const base = 'http://localhost:3005'

/**
 * 获取用户详情
 * @param data
 */
export const getUser = (): Promise<any> => 
  request.post({
    url: `${base}/gk/dt/getUser`,
    data: {},
  })

/**
* 登录
* @param data
*/
export const login = (data): Promise<any> =>
  request.post({
    url: `${base}/gk/dt/login`,
    data,
  })

/**
 * 保存用户信息
 * @param data
 */
export const update = (data): Promise<any> =>
  request.post({
    url: `${base}/gk/dt/update`,
    data,
  })

/**
 * 获取红包列表
 */

export const redPacket = (): Promise<any> =>
  request.post({
    url: `${base}/gk/dt/redPacket`,
    data: {},
  })

/**
 * 交易
 * @param data
 */
export const trade = (data): Promise<any> =>
  request.post({
    url: `${base}/gk/dt/trade`,
    data,
  })

/**
 * 获取订单记录
 */
export const getOrderList = (data): Promise<any> =>
  request.post({
    url: `${base}/gk/dt/getOrderList`,
    data,
  })

/**
 * 获取兑换记录
 */
export function geTexchangeList(data) {
  return Taro.cloud.callFunction({ name: 'exchangeList', data })
}

/**
 * 获取题目
 */
export const getQs = (data): Promise<any> =>
  request.post({
    url: `${base}/gk/dt/getQs`,
    data,
  })

/**
 * 答题操作
 */
export const answer = (data): Promise<any> =>
  request.post({
    url: `${base}/gk/dt/answer`,
    data,
  })


/**
 * 提交意见
 */
export const suggest = (data): Promise<any> =>
  request.post({
    url: `${base}/gk/dt/suggest`,
    data,
  })

/**
 * 排行榜
 */

export const rank = (data): Promise<any> =>
  request.post({
    url: `${base}/gk/dt/rank`,
    data,
  })

/**
* 系统时间
*/
export const systemTime = (): Promise<any> =>
  request.post({
    url: `${base}/gk/dt/systemTime`,
    data: {},
  })
