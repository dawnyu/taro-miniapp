import Taro, { useState, useDidShow } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { getWithdraw } from '@/service/cloud'
import { TradeEnum } from '@/enum'
import './index.scss'

function Index() {
  const [records, setRecords] = useState()

  useDidShow(async () => {
    const res: any = await getWithdraw()
    setRecords(res.data)
  })
  const setClipboardData = () => {
    Taro.showModal({
      title: '温馨提示',
      content: '微信号复制成功，请添加客服微信，审核您的兑换订单',
      confirmText: '我知道了',
      confirmColor: 'red',
    })
    Taro.setClipboardData({
      data: 'dawning_yu',
    }).then(() => {
      Taro.hideToast()
    })
  }
  
   return (
    <View className='container'>
       {records && records.length && 
        <View
          onClick={setClipboardData}
          className='header'>
          <Text>添加客服微信审核</Text>
       </View>}
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
                <Text className={item.check === 0 ? 'check' : 'over'}>{['待审核', '已到账'][item.check]}</Text>
            </View>
          </View>)
        }
      </View>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '兑换记录'
}

export default Index