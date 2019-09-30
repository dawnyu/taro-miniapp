import Taro from '@tarojs/taro'
import { View, OpenData } from '@tarojs/components'
import './index.scss'

function Index() {
  return (
    <View className='container'>
      <View className='header'>
        <View className='user-avatar'>
          <OpenData type='userAvatarUrl' />
        </View>
      </View>
      <View className='body'>
        <View>
          在这里每天答答题，还能赚杯咖啡钱，约约好友一起答题，共度美好时光。
        </View>
      </View>

    </View>
  )
}

Index.config = {
  navigationBarTitleText: '关于'
}

export default Index