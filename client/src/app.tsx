import Taro, { Component, Config } from '@tarojs/taro'
// import './utils/ald-stat'
import '@tarojs/async-await'
import Index from './pages/index'
import './assets/iconfont/iconfont.scss'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class _App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/my/index',
      'pages/index/index',
      'pages/questionBank/index',
      'pages/answer/index',
      'pages/redPacket/index',
      'pages/rank/index',
      'pages/mission/index',
      'pages/friends/index',
      'pages/my/check/index',
      'pages/my/withdraw/index',
      'pages/my/suggest/index',
      'pages/my/award/index',
      'pages/my/account/index',
    ],
    permission: {
    },
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#1D2045',
      navigationBarTitleText: '全民答题',
      navigationBarTextStyle: 'white',
    },
    cloud: true
  }

  async componentDidMount() {
    const query: any = this.$router.params.query
    if (query && query.superior) {
      Taro.setStorage({
        key: 'superior',
        data: query.superior,
      })
    }
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
    const { authSetting } = await Taro.getSetting()
    Taro.setStorageSync('isAuth', authSetting['scope.userInfo'])
  }

  componentDidShow () {
    const updateManager = Taro.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      Taro.showModal({
        title: '更新提示',
        content: '新题库已更新，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
  }

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<_App />, document.getElementById('app'))
