import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components';
import './index.scss';

function RedPacket({ data }) {
  const toRedPacketDetail = () => {
    Taro.navigateTo({
      url: `/pages/redPacket/index?id=${data.id}`
    })
  }
  return (
    <View
      onClick={() => toRedPacketDetail()}
      className='red-packet-container'
    >
      {(data.type === 3 || data.type === 4 || data.type === 6) &&
        <View className='red-packet-image'>
          <View className='red-packet-type'>现金红包</View>
          <View className='red-packet-value'>{data.value}元</View>
        </View>}
      {data.type === 5 && <View className='good-image'></View>}
      {data.type === 13 && <Image className='kind-image' src={data.image}/>}
      <View className='red-packet-title'>
        {data.title}
      </View>
      <View className='red-packet-price'>
        <Text>库存 {data.inventory}件</Text>
        <Text> {data.price}答题币</Text>
      </View>
      <View className='red-packet-button'>0元兑换</View>
    </View>
  )
}
RedPacket.options = {
  addGlobalClass: true
}
export default RedPacket;