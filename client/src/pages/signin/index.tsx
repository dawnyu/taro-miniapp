import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCalendar } from 'taro-ui'
import dayjs from 'dayjs'
import './index.scss'

function Index() {

  const maxDate = dayjs().format('YYYY-MM-DD')
  return (
    <View className='container'>
      <AtCalendar
        maxDate={maxDate}
        marks={[{ value: '2019/09/11' }]}
      />
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '签到任务'
}

export default Index