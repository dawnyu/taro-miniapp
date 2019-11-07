import Taro, { useContext, useDidShow, useState } from '@tarojs/taro'
import { View, OpenData, Image, Text } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import { QuestionEnum } from '@/enum'
import { getSign } from '@/service/cloud'
import './index.scss'

function Index() {
  const { qtype, userInfo, config } = useContext(store) as any
  const [sign, setSign] = useState()
  useDidShow(() => {
    getSign().then(res => {
      setSign({ ...res.data })
    })
  })
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
        <View className='banner'>
          <View className='item'>
            <Text>{userInfo.balance || 0}</Text>
            <Text>{config.unit}</Text>
          </View>
          <View className='item'>
            <Text>{userInfo.answersheet || 0}</Text>
            <Text>答题卡</Text>
          </View>
          {config.check === 1 && 
          <View className='item'>
            <Text>{userInfo.withdrawTime || 0}</Text>
            <Text>兑换卡</Text>
          </View>}
          <View className='item'>
            <Text>{sign.sum || 0}</Text>
            <Text>连续签到</Text>
          </View>
          <View className='item'>
            <Text>{sign.total || 0}</Text>
            <Text>累计签到</Text>
          </View>
        </View>
      </View>
      <View className='body'>
        <View
          className='item'
          onClick={() => Taro.navigateTo({ url: '/pages/my/withdraw/index' })}>
          <Image className='image' src='http://cdn.geekbuluo.com/huodong.png'/>
          <Text>兑换记录</Text>
        </View>
        <View
          className='item'
          onClick={() => Taro.navigateTo({ url: '/pages/my/award/index' })}>
          <Image className='image' src='http://cdn.geekbuluo.com/jifen.png' />
          <Text>收支记录</Text>
        </View>
        <View
          className='item'>
          <Image
            className='image'
          src='http://cdn.geekbuluo.com/zhanghao.png'
            onClick={() => Taro.navigateTo({ url: '/pages/my/account/index' })}
            />
          <Text>账号设置</Text>
        </View>
        <View
          className='item'
          onClick={() => Taro.navigateTo({ url: '/pages/my/suggest/index' })}>
          <Image className='image' src='http://cdn.geekbuluo.com/yijianjianyi.png' />
          <Text>意见反馈</Text>
        </View>
        <View className='item'>
          <Image className='image' src='http://cdn.geekbuluo.com/qrcode.png' />
          <Text>我的海报</Text>
        </View>
      </View>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '我的',
  navigationBarBackgroundColor: '#feab01'
}

export default observer(Index)