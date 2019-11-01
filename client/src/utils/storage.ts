import Taro from '@tarojs/taro'

class Storages {
  get(key) {
    const object = Taro.getStorageSync(key)
    if (object.timeout && Date.now() > object.timeout) {
      return Taro.removeStorageSync(key)
    }
    return object.value || ''
  }
  set(key, value, timeout = 0) {
    if (!key) throw new Error('key is not undefined')
    let _timeout = +timeout
    const object: any = { value }
    if (_timeout) {
      object.timeout = Date.now() + 1000 * 60 * _timeout
    }
    Taro.setStorageSync(key, object)
    return value
  }
}
export default new Storages()
