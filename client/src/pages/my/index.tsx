import Taro, { useContext, useDidShow, useState } from '@tarojs/taro'
import { View, OpenData, Image, Text, Ad } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import { getSign } from '@/service/cloud'
import './index.scss'

function Index() {
  const { userInfo, check } = useContext(store) as any
  const [sign, setSign] = useState()
  useDidShow(() => {
    getSign().then(res => {
      setSign({ ...res.data })
    })
  })

  return (
    <View className='container'>
      <View className='header'>
        <View className='user'>
          <View className='user-avatar'>
            <OpenData type='userAvatarUrl' />
          </View>
          <View className='user-nickname'>
            <OpenData type='userNickName' />
          </View>
        </View>
        <View className='banner'>
          <View className='item'>
            <Text>{userInfo.balance || 0}</Text>
            <Text>答题币</Text>
          </View>
          <View className='item'>
            <Text>{userInfo.answersheet || 0}</Text>
            <Text>答题卡</Text>
          </View>
          <View className='item'>
            <Text>{userInfo.withdrawTime || 0}</Text>
            <Text>兑换卡</Text>
          </View>
          <View className='item'>
            <Text>{sign.sum || 0}</Text>
            <Text>连续签到</Text>
          </View>
        </View>
      </View>
      <View className='body'>
        <View
          className='item'
          onClick={() => Taro.navigateTo({ url: '/pages/my/withdraw/index' })}>
          <Image className='image' src='https://cdn.geekbuluo.com/huodong.png'/>
          <Text>兑换记录</Text>
        </View>
        <View
          className='item'
          onClick={() => Taro.navigateTo({ url: '/pages/my/award/index' })}>
          <Image className='image' src='https://cdn.geekbuluo.com/jifen.png' />
          <Text>收支记录</Text>
        </View>
        <View
          className='item'>
          <Image
            className='image'
          src='https://cdn.geekbuluo.com/zhanghao.png'
            onClick={() => Taro.navigateTo({ url: '/pages/my/account/index' })}
            />
          <Text>账号设置</Text>
        </View>
      </View>
      <View className='banner-ad'>
        <Ad
          unitId="adunit-835fed49a77040b4"
          unit-id="adunit-835fed49a77040b4"
          ad-intervals={60}></Ad>
      </View>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '我的',
  navigationBarBackgroundColor: '#ff5748'
}

export default observer(Index)