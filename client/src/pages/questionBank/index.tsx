import Taro, { useContext } from '@tarojs/taro'
import { View} from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import QBlock from '@/components/QBlock/index'
import './index.scss'

function Index() {
  const { qtype, setQType } = useContext(store) as any

  const qList = [
    {
      image: 'https://cdn.geekbuluo.com/chengyu-min.png',
      name: '成语题库',
      type: 0,
    },
    // {
    //   image: 'https://cdn.geekbuluo.com/gushici-min.png',
    //   name: '诗词题库',
    //   type: 1,
    // },
    {
      image: 'https://cdn.geekbuluo.com/jiakao-min.png',
      name: '驾考题库',
      type: 2,
    }
  ]
  const selected = (type = 0): any => {
    Taro.setStorage({
      key: 'qtype',
      data: type,
    })
    setQType(type)
    Taro.navigateBack({ delta: 1 })
  }
  return (
    <View className='container'>
      <View className='header-line'>热门题库</View>
      <View className='block'>
      {
        qList.map(item => 
          <QBlock
            key={item.name}
            selected={item.type === qtype}
            onClick={() => selected(item.type)}
            data={item}
          />)}
        </View>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '选择题库',
  navigationBarBackgroundColor: '#feab01'
}

export default observer(Index)