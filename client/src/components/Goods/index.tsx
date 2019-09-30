import Taro, { View, Text, Image } from '@tarojs/components';
import './index.scss';

function Goods() {
 const good = {
    value: 10000,
    title: '100元话费',
   image: 'http://cdn.geekbuluo.com/100huafei.png'
  }
  return (
    <View className='good-container'>
      <View className='good-image'>
        <Image src={good.image} />
      </View>
      <View className='good-title'>
        {good.title}
      </View>
      <View className='good-price'>
        <Text>库存 8件</Text>
        <Text> {good.value}
        <Text className='iconfont icon-yuanbao' /></Text>
        
      </View>
      <View className='good-button'>立即兑换</View>
    </View>
  )
}
Goods.options = {
  addGlobalClass: true
}
export default Goods;