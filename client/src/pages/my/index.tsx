import Taro, { useContext } from '@tarojs/taro'
import { View, OpenData, Image } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import { QuestionEnum } from '@/enum'
import './index.scss'

function Index() {
  const { qtype } = useContext(store) as any

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
        <View className='user-qtype'>正在使用：[{QuestionEnum[qtype]}]</View>
      </View>
      <View className='body'>
        <View
          className='item'
          onClick={() => Taro.navigateTo({ url: '/pages/my/withdraw/index' })}
        >
          <View className='left'>
            <Image src='http://cdn.geekbuluo.com/datizhuanqian.png' />
            <View>权益记录</View>
          </View>
          <View className='at-icon at-icon-play'></View>
        </View>
        <View
          className='item'
          onClick={() => Taro.navigateTo({ url: '/pages/my/award/index' })}
        >
          <View className='left'>
            <Image src='http://cdn.geekbuluo.com/yuanbaojilu-min.png' />
            <View>操作记录</View>
          </View>
          <View className='at-icon at-icon-play'></View>
        </View>
        <View
          className='item'
          onClick={() => Taro.navigateTo({ url: '/pages/my/friends/index' })}
        >
          <View className='left'>
            <Image src='http://cdn.geekbuluo.com/yuanbaojilu-min.png' />
            <View>我的好友</View>
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
      </View>
      
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '我的'
}

export default observer(Index)