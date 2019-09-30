import Taro, { useContext } from '@tarojs/taro'
import { View, OpenData, Image } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import './index.scss'

function Index() {
  const { userInfo } = useContext(store) as any

  console.log(userInfo)

  return (
    <View className='container'>
      <View className='header'>
        <Image
          className='crown'
          src='http://cdn.geekbuluo.com/huangguan-min.png'
        />
        <View className='user-avatar'>
          <OpenData type='userAvatarUrl' />
        </View>
        <View className='user-nickname'>
          <OpenData type='userNickName' />
        </View>
        <View className='user-qtype'>正在使用：[成语题库]</View>
      </View>
      <View className='body'>
        <View className='item'>
          <View className='left'>
            <Image src='http://cdn.geekbuluo.com/tilkujilu-min.png' />
            <View>元宝记录</View>
          </View>
          <View className='at-icon at-icon-play'></View>
        </View>
        <View className='item'>
          <View className='left'>
           <Image src='http://cdn.geekbuluo.com/yuanbaojilu-min.png' />
            <View>兑换记录</View>
          </View>
          <View className='at-icon at-icon-play'></View>
        </View>
        <View
          className='item'
          onClick={() => Taro.navigateTo({ url: '/pages/my/suggest/index' })}
        >
          <View className='left'>
           <Image src='http://cdn.geekbuluo.com/yijianxiang-min.png' />
            <View>意见反馈</View>
          </View>
          <View className='at-icon at-icon-play'></View>
        </View>
        <View
          className='item'
          onClick={() => Taro.navigateTo({ url: '/pages/my/aboutus/index' })}
        >
          <View className='left'>
            <Image src='http://cdn.geekbuluo.com/guanyuwomen-min.png' />
            <View>关于</View>
          </View>
          <View className='at-icon at-icon-play'></View>
        </View>
      </View>
      
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '我的'
}

export default observer(Index)