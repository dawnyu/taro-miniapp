import Taro, { useDidShow, useState, useContext, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Image, Button, Ad } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import { getFriends } from '@/service/cloud'
import friend from '@/assets/images/banner-min.png'
import './index.scss'

function Index() {
  const { userInfo, check } = useContext(store) as any
  const [list, setList] = useState()
  useShareAppMessage(res => {
    {
      if (res.from === 'button') {
      }
      return {
        title: '来跟我一起答题呀>.<',
        path: `/pages/index/index?superior=${userInfo.openid}`,
        imageUrl: 'https://cdn.geekbuluo.com/20191101012651-min.jpg'
      }
    }
  })
  
  useDidShow(async () => {
    Taro.showLoading()
    try {
      const { data } = await getFriends({ openid: userInfo })
      setList([...data])
      Taro.hideLoading()
    } catch (error) {
      Taro.hideLoading()
    }
    Taro.hideLoading()
  })
  return (
    <View className='container'>
      {check &&
      <Image
        mode='widthFix'
        className='friend-banner'
        src={friend}/>}
      {
        check && <View className='friend-tip'>永久享好友收益的10%+1兑换卡</View>
      }
      <View className='banner-ad'>
        <Ad
          unitId="adunit-e6e41877385adafb"
          unit-id="adunit-e6e41877385adafb"
          ad-intervals={60}></Ad>
      </View>
      {
        <Button
          className='share'
          openType='share'>{check ? `推荐好友得答题币和兑换卡` : '添加好友'}</Button>
      }
      <View className='content'>
        <View className='header-line'>
          <Text>好友昵称</Text>
          <Text>帮我助力</Text>
        </View>
        <View className='body'>
          {list && list.length > 0 && list.map((item, index) =>
            <View
              className='record-item'
              key={item}
            >
              <View className='left'>
                <View>{index + 1}</View>
                <Image src={item.avatarUrl} />
                <View>{item.nickName}</View>
              </View>
              <View className='right'>
                <View>
                  {item.superiorEarnings || 0}答题币
                </View>
              </View>
            </View>)}
          {(!list || list && list.length === 0) &&
            <View className='nofriends'>
              <View> 还没有好友哦~ </View>
            </View>}
        </View>

      </View>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '好友列表',
  navigationBarBackgroundColor: '#fd6418'
}

export default observer(Index)