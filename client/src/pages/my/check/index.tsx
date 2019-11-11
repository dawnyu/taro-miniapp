import Taro, { useContext, useDidShow } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import './index.scss'

function Index() {
  const { config, getConfig } = useContext(store) as any

  useDidShow(async() => {
    await getConfig()
  })

  const previewImage = () => {
    Taro.previewImage({
      current: config.flock,
      urls: [config.flock]
    })
  }

  return (
    <View className='container'>
      <View className='body'>
        <View className='header-line'><Text>1</Text>添加微信审核群</View>
        <View>
          <Image
            mode='aspectFit'
            onClick={previewImage}
            src={config.flock} />
          <View className='content-line'>点击二维码预览，长按加入审核群</View>
        </View>
        <View className='header-line'><Text>2</Text>
        答题币兑换红包后 @客服筱筱 审核
        </View>
      </View>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '审核规则',
  navigationBarBackgroundColor: '#feab01'
}

export default observer(Index)