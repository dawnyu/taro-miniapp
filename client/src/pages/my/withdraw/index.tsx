import Taro, { useState, useDidShow } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { getWithdraw } from '@/service/cloud'
import { TradeEnum } from '@/enum'
import './index.scss'

function Index() {
  const [records, setRecords] = useState()

  useDidShow(async () => {
    const res: any = await getWithdraw()
    const list = [...res.data]
    setRecords([...list])
  })
  
   return (
    <View className='container'>
      <View className='header'>
        <Text>商品名称</Text>
        <Text>兑换时间</Text>
        <Text>审核状态</Text>
      </View>
      <View className='body'>
        {
          records && records.map(item =>
          <View
            className='record-item'
            key={item.id}>
            <View className='left'>
              <View>{TradeEnum[item.type * 1]}</View>
            </View>
            <View className='center'>{item.tradeTime}</View>
            <View className='right'>
                <Text className={item.check === 0 ? 'check' : 'over'}>{['待审核', '已到账'][item.check]}</Text>
            </View>
          </View>)
        }
        {
          records && records.length > 10 && <View className='bottom'>——我是有底线的——</View>
        }
        {
          (!records || records && records.length === 0) && <View className='bottom'>暂无记录</View>
        }
       
      </View>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '兑换记录',
  navigationBarBackgroundColor: '#feab01'
}

export default Index