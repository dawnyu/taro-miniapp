import Taro, { useContext, useDidShow } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import './index.scss'

function Index() {
  const { config, check, getConfig } = useContext(store) as any

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
     {
        check && <View className='body'>
          <View className='header-line'><Text>1</Text>联系客服审核</View>
          <View>
            <Image
              mode='aspectFit'
              onClick={previewImage}
              src={config.flock} />
            <View className='content-line'>点击二维码预览保存，长按添加，备注：答题审核</View>
          </View>
        </View>
     }
     {
        !check && <View>
          请联系客服咨询
        </View>
     }
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '审核规则',
  navigationBarBackgroundColor: '#feab01'
}

export default observer(Index)