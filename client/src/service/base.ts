import Taro from '@tarojs/taro'
// const base = 'https://api.geekbuluo.com'
const url = 'http://localhost:3005/gk/dtApi'
class Request {
  header = {
    'content-type': 'application/json'
  }

  // 暂时微信平台， 多平台此处需要优化
  async getOpenid() {
    const localOpenid = Taro.getStorageSync('openid')
    const localAppid = Taro.getStorageSync('appid')
    if (!localOpenid) {
      const { result: { openid, appid } }: any = await Taro.cloud.callFunction({ name: 'login' })
      Taro.setStorage({ key: 'openid', data: openid })
      Taro.setStorage({ key: 'appid', data: appid })
      return { openid, appid }
    } else {
      return {
        openid: localOpenid,
        appid: localAppid
      }
    }
    
  }

  async post({action, data}) {
    data = {
      platform: Taro.getEnv(),
      action,
      ...data,
      ... await this.getOpenid()
    }
    return new Promise((resolve) => {
      Taro.request({
        url,
        data,
        method: 'POST',
        header: this.header
      }).then(res => {
        if (res.statusCode === 200 || res.statusCode === 201) resolve(res.data)
      })
    })
  }
}

export default new Request()


