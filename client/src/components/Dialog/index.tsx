import Taro, { useContext } from '@tarojs/taro'
import store from '@/store/index'
import { observer } from '@tarojs/mobx'
import { View, Text, Image, Ad } from '@tarojs/components'
import './index.scss'

// options: {type: 1=答题答对题 2=答题答错题}
function Dialog(props: any)  {
  const { visible, close, options } = props
  const { config } = useContext(store) as any

  const previewImage = () => {
    Taro.previewImage({
      current: config.flock,
      urls: [config.flock]
    })
  }
  return (
    visible && 
    <View className='container'>
        <View className='content'>
        {options.title && <View className='title'>{options.title}</View>}
          <View className='body'>
          {
            options.type === 2 &&
            <Image
              className='image'
              mode='aspectFit'
              src='https://cdn.geekbuluo.com/973b40c1d2fd9a051d9523c33bd42a20.png' />
          }
          {options.type === 1 &&
            <View className='label'>
              {
                options.answersheet <= 0 ?
                  <View>
                    <View>答题卡已用完</View>
                    <View>本次答题无奖励</View>
                  </View>
                  :
                  <View>奖励<Text className='label-value'>{options.award}</Text>答题币
                  </View>
              }
            </View>}
          {
            options.type === 3 &&
            <View className='attention'>
              <Image mode='aspectFill'
                className='qrcode'
                onClick={previewImage}
                src={config.qrcode}/>
                <View>点击二维码加入审核群</View>
            </View>
          }
          </View>
          {
            (options.type === 1 || options.type === 2) && 
            <View className='answersheet'>剩余答题卡 x {options.answersheet}</View>
          }
        <View className='banner-ad'>
          <Ad
            unitId="adunit-effb4b2965cc8895"
            unit-id="adunit-effb4b2965cc8895"
            ad-intervals={60}></Ad>
        </View>
          <View
            onClick={close}
            className='close'>点击关闭</View>
        </View>
    </View>
  )
}
export default observer(Dialog)