import Taro, { useContext, useState, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import { AtModal } from 'taro-ui'
import store from '@/store/index'
import { getQs } from '@/service/cloud'
import './index.scss'

function Index() {
  const { qtype, answer, userInfo, config} = useContext(store) as any
  const [visible, setVisible] = useState(false)
  const [right, setRight] = useState(false)
  const [award, setAward] = useState(0)
  const [answersheet, setAnswersheet] = useState(userInfo.answersheet)
  const [topic, setTopic] = useState({
    id: '',
    type: 0,
    title: [],
    options: [],
    answer: '',
  })
  useShareAppMessage(() => {
    return {
      title: '好友发红包啦，快来答题分红包吧！',
      path: `/pages/index/index?superior=${userInfo.openid}`,
      imageUrl: 'http://cdn.geekbuluo.com/20191101012651-min.jpg'
    }
  })

  const rightOption = {
    image: 'http://cdn.geekbuluo.com/daduile.png',
    title: '恭喜您答对了',
  }
  const failOption = {
    image: 'http://cdn.geekbuluo.com/jusang-min.png',
    title: '很遗憾答错了',
  }

  useDidShow(() => {
    nextQs()
  })

  const nextQs = () => {
    getQs({ type: qtype }).then(({ data }) => {
      if (qtype === 0) {
        if (data.length === 0) {
          Taro.showToast({
            title: '暂时未加载到题目',
          })
          setTopic({
            id: '',
            type: 0,
            title: [],
            options: [],
            answer: '',
          })
        } else {
          setTopic({
            ...data || []
          })
        }
      }
    })
  }

  const answerHanle = async(val) => {
    let random = 0
    if (userInfo.answersheet >= 0) {
      random = Math.round(Math.random() * 3) + 1
    }
    setAward(random)
    setVisible(true)
    setRight(val)
    await answer({
      random,
      qid: topic.id,
      type: qtype,
      right: val,
    })
    setAnswersheet(userInfo.answersheet)
    nextQs() // 切换下一题
  }

  return (
    <View className='container'>
      <View className='topic'>
        {qtype === 0 && 
        <View className='idiom-title'>
          {topic.title.map(item => <Text key={item}>{item === '?' ? '__': item}</Text>)}
        </View>}
      </View>
      {qtype === 0 &&
        <View
          className='idiom-option'
        >
          {topic.options.map((item) => 
            <Text
              onClick={() => answerHanle(item === topic.answer)}
              key={item}
            >
            {item}
            </Text>
          )}
        </View>}
      <AtModal
        isOpened={visible}
        closeOnClickOverlay
      >
        {!right &&
          <View className='atmodal-content'>
            <Image src={failOption.image} />
            <View className='atmodal-content-label'>
              <View>{failOption.title}</View>
              <View>
              </View>
              <View
                onClick={() => setVisible(false)}
                className='modal-close'
              >
                <View className='iconfont icon-guanbi'></View>
              </View>
            </View>
          </View>}
        {right &&
          <View className='atmodal-content'>
            <Image src={rightOption.image} />
            <View className='atmodal-content-label'>
              <View>{rightOption.title}</View>
              {
                answersheet <= 0 ?
                <View>
                  <Text>答题卡已用完，本次答题无奖励</Text>
                </View>
                : 
                <View>获得
                <Text className='atmodal-content-label-value'>{award}</Text>{config.unit}
                </View>
              }
              <View
                onClick={() => setVisible(false)}
                className='modal-close'
              >
                <View className='iconfont icon-guanbi'></View>
              </View>
            </View>
          </View>}
      </AtModal>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '答题',
  navigationBarBackgroundColor: '#feab01'
}

export default observer(Index)