import Taro, { Component, Config } from '@tarojs/taro'
import '@tarojs/async-await'
import Index from './pages/index'
import './assets/iconfont/iconfont.scss'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',
      'pages/questionBank/index',
      'pages/answer/index',
      'pages/redPacket/index',
      'pages/rank/index',
      'pages/mission/index',
      'pages/my/index',
      'pages/my/withdraw/index',
      'pages/my/suggest/index',
      'pages/my/award/index',
      'pages/my/friends/index',
      
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

  componentDidMount () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  }

  componentDidShow () {}

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

Taro.render(<App />, document.getElementById('app'))
