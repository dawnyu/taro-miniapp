import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import './index.scss';

function RedPacket({ data }) {
  const toRedPacketDetail = () => {
    Taro.navigateTo({
      url: `/pages/redPacket/index?id=${data.id}&type=${data.type}
      &goodDetails=${data.goodDetails}&price=${data.price}
      &value=${data.value}&title=${data.title}&inventory=${data.inventory}`
    })
  }
  return (
    <View
      onClick={() => toRedPacketDetail()}
      className='red-packet-container'
    >
      <View className='red-packet-image'>
        <View className='red-packet-type'>现金红包</View>
        <View className='red-packet-value'>{data.value}元</View>
      </View>
      <View className='red-packet-title'>
        {data.title}
      </View>
      <View className='red-packet-price'>
        <Text>库存 {data.inventory}件</Text>
        <Text> {data.price}
          <Text className='iconfont icon-yuanbao' /></Text>
      </View>
      <View className='red-packet-button'>去兑换</View>
    </View>
  )
}
RedPacket.options = {
  addGlobalClass: true
}
export default RedPacket;