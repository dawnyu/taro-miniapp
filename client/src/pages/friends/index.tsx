import Taro, { useDidShow, useState, useContext, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import { getFriends } from '@/service/cloud'
import './index.scss'

function Index() {
  const { userInfo, config } = useContext(store) as any
  const [list, setList] = useState()
  useShareAppMessage(res => {
    {
      if (res.from === 'button') {
      }
      return {
        title: '来跟我一起答题呀>.<',
        path: `/pages/index/index?superior=${userInfo.openid}`,
        imageUrl: 'http://cdn.geekbuluo.com/20191101012651-min.jpg'
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
      {
        <Button
          className='share'
          openType='share'>{config.check === 1 ? `推荐好友得${config.unit}和兑换卡` : '添加好友'}</Button>
      }
      <View className='header-line'>
        <Text>好友昵称</Text>
        {
          config.check === 1 && <Text>提成</Text>
        }
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
                {item.superiorEarnings || 0}{config.unit}
            </View>
            </View>
        </View>)}
        {(!list || list && list.length === 0) &&
        <View className='nofriends'>
          <View> 还没有好友哦~ </View>
        </View>}
      </View>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '好友列表',
  navigationBarBackgroundColor: '#feab01'
}

export default observer(Index)