import Taro, { useRouter, useDidShow, useState, useContext } from '@tarojs/taro'
import store from '@/store/index'
import { observer } from '@tarojs/mobx'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.scss'

function RedPacket() {
  const { userInfo, trade } = useContext(store) as any
  const router = useRouter()
  const [details, setDetails] = useState()
  console.log(33, router.params)
  useDidShow(() => {
    setDetails({
      ...router.params,
      goodDetails: router.params.goodDetails && router.params.goodDetails.split('<br>')
    })
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
      })
    }
  }
  return (
    <View className='container'>
      <View className='red-packet-container'>
        <View className='red-packet-image'>
          <Image src={details.image} />
        </View>
        <View className='red-packet-title'>{details.title}</View>
        <View className='red-packet-price'>
          <View>
            <Text>{details.price}答题币</Text>
          </View>
          <Text>剩余{details.inventory}个</Text>
        </View>
      </View>
      <View className='good-detail'>
        <View className='header-line'>兑换详情</View>
        <View className='good-detail-info'>
          {details.goodDetails.map(item => 
            <View key={item}>{item}</View>)}
        </View>
      </View>
      <View className='red-packet-button'>
        {userInfo.newuser && details.type * 1 === 3 && <Button onClick={() => conversion()}>去兑换</Button>}
        {!userInfo.newuser && details.type * 1 === 3 && <Button className='disable-btn'>新用户才能兑换</Button>}
        {(details.type * 1 === 4 || details.type * 1 === 5 || details.type * 1 === 6) && <Button onClick={() => conversion()}>去兑换</Button>}
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