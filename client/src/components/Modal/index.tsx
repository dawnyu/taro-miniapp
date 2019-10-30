import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtModal } from 'taro-ui'
import './index.scss'

interface Props {
  options: {
    text: any,
    title: string,
    visible: boolean
    close: () => void
  },
}
function Index(props: Props) {
  const close = () => {
    props.options.close()
  }
  return (
    <AtModal
      isOpened={props.options && props.options.visible}
      closeOnClickOverlay={false}
    >
      {
        <View className='atmodal-content'>
          <View className='title'>
            {props.options && props.options.title}
          </View>
          <View className='body'>
            {(props.options &&
              Object.prototype.toString.call(props.options.text) === '[object String]') &&
              <Text>{props.options.text}</Text>}
            {props.options && Array.isArray(props.options.text)
              && props.options.text.map((item, index) => 
              <View className='item' key={item}><Text>{index + 1}</Text>{item}</View>)}
          </View>
          <View
            onClick={close}
            className='close'>点击关闭</View>
        </View>}
    </AtModal>
    )
}

export default Index