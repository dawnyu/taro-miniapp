import Taro, { useRouter, useDidShow, useState, useContext } from '@tarojs/taro'
import store from '@/store/index'
import { observer } from '@tarojs/mobx'
import { View, Text, Image, Button } from '@tarojs/components'
import storage from '@/storage'
import './index.scss'

function RedPacket() {
  const { userInfo, trade, config } = useContext(store) as any
  const router = useRouter()
  const [details, setDetails] = useState()
  const [buttonText, setButtonText] = useState('')
  useDidShow(() => {
    const goods = storage.get('goods')
    const good = goods.find(item => item.id === +router.params.id)
    setDetails({
      ...good,
      goodDetails: good.goodDetails && good.goodDetails.split('<br>')
    })
    setButtonText(`${good.price}${config.unit}${good.withdraw > 0 ? `+${good.withdraw}兑换卡` : ''}`)
  })
  const conversion = async () => {
    try {
      await trade({ redPacketId: details.id, type: details.type * 1 })
      Taro.showToast({
        title: '兑换成功',
        icon: 'none'
      })
    } catch (e) {
      Taro.showToast({
        title: e.message,
        icon: 'none',
        duration: 3000,
      })
    }
  }
  return (
    <View className='container'>
      <View className='red-packet-container'>
        <View className='red-packet-image'>
          <Image src={details.image} />
          {
            (details.type === 3 || details.type === 4 || details.type === 6) &&
            <View className='float'>
              <View className='type'>现金红包</View>
              <View className='value'>{details.value}元</View>
            </View>
          }
        </View>
        <View className='red-packet-title'><Text>{details.title}</Text><Text>剩余{details.inventory}个</Text></View>
        {/* <View className='red-packet-price'>
          <View>{details.price}{config.unit} {details.withdraw > 0 ? <Text>消耗{details.withdraw}答题卡</Text> : null} </View>
        </View> */}
      </View>
      <View className='good-detail'>
        <View className='header-line'>兑换详情</View>
        <View className='good-detail-info'>
          {details.goodDetails.map(item => 
            <View key={item}>{item}</View>)}
        </View>
      </View>
      <View className='red-packet-button'>
        {!userInfo.newuser && details.type * 1 === 3 && <Button className='disable-btn'>新用户才能兑换</Button>}
        {!(!userInfo.newuser && details.type * 1 === 3) && <Button onClick={() => conversion()}>{buttonText}</Button>}}
      </View>
    </View>
  )
}
RedPacket.options = {
  addGlobalClass: true
}
RedPacket.config = {
  navigationBarBackgroundColor: '#F3AD3D',
}
export default observer(RedPacket);