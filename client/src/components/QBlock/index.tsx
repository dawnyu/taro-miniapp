import Taro, { View, Text, Image } from '@tarojs/components'
import './index.scss'

interface Props {
  onClick: () => {}
  selected
  data: {
    image,
    name,
    type,
  }
}
function Index(props: Props) {
  const { data = { image: '', name: '', type: ''}, onClick, selected} = props
  return (
    <View
      className='box'
      onClick={onClick}
    >
      <Image src={data.image} />
      <Text>{data.name}</Text>
      {selected && <View className='tip'>已选</View>}
    </View>
  )
}

export default Index