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
    const { status } = await update(payload)
    if (status === 0) {
      runInAction(async() => {
        await this.getUser()
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
    Taro.showLoading()
    const { status } = await answer(payload)
    if (status === 0) {
      await this.getUser()
      Taro.hideLoading()
    } else {
      Taro.hideLoading()
      throw new Error('更新失败')
    }
  }

  /**
   * 设置题类型
   * @param question
   */
  setQType(qtype) {
    this.qtype = qtype
  }

  async getGoods() {
    const localGoods = storage.get('goods')
    if (localGoods) {
      this.goods = localGoods
    } else {
      const { data } = await getGoods()
      runInAction(() => {
        this.goods = data || []
      })
      if (data && data.length > 0) {
        storage.set('goods', data, 60 * 24)
      }
    }
  }
}

decorate(Index, {
  userInfo: observable,
  getUser: action.bound,
  update: action.bound,
  login: action.bound,
  qtype: observable,
  setQType: action.bound,
  goods: observable,
  getGoods: action.bound,
  trade: action.bound,
  answer: action.bound,
})

export default createContext(new Index())
