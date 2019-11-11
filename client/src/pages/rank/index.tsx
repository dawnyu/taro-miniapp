import Taro, { useDidShow, useState } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import {rank} from '@/service/cloud'
import './index.scss'
import moment from 'moment'

function Index() {
  const [list, setList] = useState()
  useDidShow(async () => {
    try {
      Taro.showLoading()
      const { data } = await rank({})
      setList([...data])
      Taro.hideLoading()
    } catch (error) {
      Taro.hideLoading()
    }
  }) 
  return (
    <View className='container'>
      <View className='title'>答题排行榜</View>
      <View className='time'>截止时间：{moment().format('YYYY-MM-DD HH')}时</View>
      <View className='body'>
        <View className='table-title'>
          <View className='left'>排名</View>
          <View className='center'>用户</View>
          <View className='right'>答题数</View>
        </View>
        {list && list.map((item, index) => 
        <View
          className='user-item'
          key={item}
        >
          <View className='left'>
            <View className={
              index===0 ? 'num1' :
              index===1 ? 'num2' :
              index===2 ? 'num3' : ''}>{index + 1}</View>
          </View>
          <View className='center'>
              <Image className='image'
                mode='scaleToFill'
                src={item.avatarUrl} />
              <View className='nickname'>{item.nickName}</View>
          </View>
          <View className='right'>{item.balance}</View>
        </View>)}
      </View>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '排行榜',
  navigationBarBackgroundColor: '#feab01'
}

export default Index