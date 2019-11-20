import request from './base'

/**
 * 获取用户详情
 * @param data
 */
export const getUser = (): Promise<any> => 
  request.post({
    action: 'getUser',
    data: {},
  })

/**
* 登录
* @param data
*/
export const login = (data): Promise<any> =>
  request.post({
    action: 'login',
    data,
  })

/**
 * 保存用户信息
 * @param data
 */
export const update = (data): Promise<any> =>
  request.post({
    action: 'update',
    data,
  })

/**
 * 获取权益列表
 */

export const getGoods = (): Promise<any> =>
  request.post({
    action: 'redPacket',
    data: {},
  })

/**
 * 交易
 * @param data
 */
export const trade = (data): Promise<any> =>
  request.post({
    action: 'trade',
    data,
  })

/**
 * 获取订单记录
 */
export const getOrderList = (data): Promise<any> =>
  request.post({
    action: 'getOrderList',
    data,
  })


/**
 * 获取兑换记录
 */
export const geTexchangeList = (data): Promise<any> =>
  request.post({
    action: 'exchangeList',
    data,
  })

/**
 * 获取题目
 */
export const getQs = (data): Promise<any> =>
  request.post({
    action: 'getQs',
    data,
  })

/**
 * 答题操作
 */
export const answer = (data): Promise<any> =>
  request.post({
    action: 'answer',
    data,
  })


/**
 * 提交意见
 */
export const suggest = (data): Promise<any> =>
  request.post({
    action: 'suggest',
    data,
  })

/**
 * 排行榜
 */

export const rank = (data): Promise<any> =>
  request.post({
    action: 'rank',
    data,
  })

/**
* 系统时间
*/
export const systemTime = (): Promise<any> =>
  request.post({
    action: 'systemTime',
    data: {},
  })

/**
* 获得好友列表
*/
export const getFriends = (data): Promise<any> =>
  request.post({
    action: 'getFriends',
    data,
  })

/**
* 获得签到详情
*/
export const getSign = (): Promise<any> =>
  request.post({
    action: 'getSign',
    data: null,
  })

/**
* 签到
*/
export const sign = (data): Promise<any> =>
  request.post({
    action: 'sign',
    data,
  })

/**
* 签到
*/
export const getWithdraw = (): Promise<any> =>
  request.post({
    action: 'getWithdraw',
    data: null,
  })

/**
* 获取头像
*/
export const getUserAvatar = (): Promise<any> =>
  request.post({
    action: 'getUserAvatar',
    data: null,
  })

/**
* 开红吧
*/
export const openRedEnvelope = (): Promise<any> =>
  request.post({
    action: 'openRedEnvelope',
    data: null,
  })

/**
* 获取配置
*/
export const getConfig = (): Promise<any> =>
  request.post({
    action: 'getConfig',
    data: null,
  })

/**
* 获取商品详情
*/
export const getGood = (data): Promise<any> =>
  request.post({
    action: 'getGood',
    data,
  })

/**
* 增加答题卡
*/
export const addAnswerSheet = (data): Promise<any> =>
  request.post({
    action: 'addAnswerSheet',
    data,
  })

/**
 * 收集formid
 * @param data
 */
export const typeinFormId = (data): Promise<any> =>
  request.post({
    action: 'typeinFormId',
    data,
  })
