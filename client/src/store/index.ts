import Taro, { createContext } from '@tarojs/taro'
import { observable, action, decorate, runInAction } from 'mobx'
import storage from '@/storage'
import {
  update,
  getGoods,
  trade,
  login,
  answer,
  getUser,
  getConfig,
  addAnswerSheet,
  transform,
  drawcash,
} from '../service/cloud'

class Index {
  userInfo = {
    openid: '',
    appid: '',
    newuser: false,
    newRedPacket: false,
    openRedPacket: false,
    answersheet: 0,
    balance: 0,
    continuousLogin: 0,
  }
  qtype = 0 // 题库类型
  goods = []
  config:any = {}
  check = false
  videoAd: any = {}

  async getUser() {
    try {
      const res = await getUser()
      runInAction(() => {
        if (res.data) {
          this.userInfo = { ...res.data }
        }
      })
    return this.userInfo
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async login(payload) {
    const { status } = await login(payload)
    if (status === 0) {
      await this.getUser()
    } else {
      throw new Error('更新失败')
    }
  }

  async trade(payload) {
    const { status, message } = await trade(payload)
    if (status === 0) {
      await this.getUser()
    } else {
      throw new Error(message)
    }
  }

  checkAuth() {
    return Taro.getSetting().then(res => {
      if (res.authSetting['scope.userInfo']) {
        return true;
      } else {
        throw new Error('没有授权')
      }
    })
  }
  
  async update(payload) {
    const { status, message } = await update(payload)
    if (status === 0) {
      runInAction(async() => {
        await this.getUser()
      })
    } else {
      throw new Error(message)
    }
  }

  async drawcash(payload) {
    const { status, message } = await drawcash(payload)
    if (status === 0) {
      runInAction(async () => {
        await this.getUser()
      })
    } else {
      throw new Error(message)
    }
  }

  async transform(payload) {
    const { status } = await transform(payload)
    if (status === 0) {
      runInAction(async () => {
        await this.getUser()
      })
    } else {
      throw new Error('更新失败')
    }
  }

  async addAnswerSheet(payload) {
    const { status, data } = await addAnswerSheet(payload)
    if (status === 0) {
      runInAction(() => {
        this.userInfo = data
      })
    } else {
      throw new Error('更新失败')
    }
  }

  /**
   * 答题操作
   * @param payload 
   */
  async answer(payload) {
    const { status } = await answer(payload)
    if (status === 0) {
      await this.getUser()
    } else {
      throw new Error('操作失败')
    }
  }
  
  async getConfig() {
    const config = storage.get('config')
    if (config) {
      this.config = config
    } else {
      const { data } = await getConfig()
      runInAction(() => {
        this.config = data || {}
      })
      if (data) {
        storage.set('config', data, 1)
      }
    }
    this.check = this.config.check1 === 1
    return this.config
  }
  /**
   * 设置题类型
   * @param question
   */
  setQType(qtype) {
    this.qtype = qtype
  }

  async getGoods() {
    const { data } = await getGoods()
    runInAction(() => {
      this.goods = data || []
    })
  }
  
  setVideoAd(key, value) {
    this.videoAd[key] = value
  }

}

decorate(Index, {
  userInfo: observable,
  config: observable,
  check: observable,
  videoAd: observable,
  getUser: action.bound,
  update: action.bound,
  transform: action.bound,
  login: action.bound,
  addAnswerSheet: action.bound,
  qtype: observable,
  getConfig: action.bound,
  setQType: action.bound,
  setVideoAd: action.bound,
  goods: observable,
  getGoods: action.bound,
  trade: action.bound,
  answer: action.bound,
})

export default createContext(new Index())
