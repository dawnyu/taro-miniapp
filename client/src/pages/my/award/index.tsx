import Taro, { useState, useContext, useDidShow } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { geTexchangeList } from '@/service/cloud'
import { TradeEnum } from '@/enum'
import store from '@/store/index'
import './index.scss'

function Index() {
  const { userInfo } = useContext(store) as any
  const [records, setRecords] = useState()

  useDidShow(async() => {
    const res: any = await geTexchangeList({ openid: userInfo.openid })
    setRecords(res.data)
  })

  return (
    <View className='container'>
      <View className='header'>
        <View>
          答题币：<Text className='balance'>{userInfo.balance}</Text></View>
      </View>
      <View className='body'>
        {
          records && records.map(item =>
          <View
            className='record-item'
            key={item.id}>
            <View className='left'>
              <View>{item.tradeTime}</View>
              <View>{TradeEnum[item.type * 1]}</View>
            </View>
            <View className='right'>
                {[3, 4, 5, 6, 9].indexOf(item.type * 1) > -1 && <Text className='in'>-{item.value}</Text>}
                {[0, 1, 2, 7, 8, 10, 11, 12].indexOf(item.type * 1) > -1 && <Text className='out'>+{item.value}</Text>}
                <Text className='unit'>答题币</Text>
            </View>
          </View>)
        }
      </View>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '收支记录'
}

export default Index