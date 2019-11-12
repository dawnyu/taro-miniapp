import Taro, { useContext, useState, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Image, Button, Ad } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import Dialog from '@/components/Dialog'
import store from '@/store/index'
import { getQs } from '@/service/cloud'
import './index.scss'

function Index() {
  const { qtype, answer, userInfo} = useContext(store) as any
  const [visible, setVisible] = useState(false)
  const [dialogOptions, setDialogOptions] = useState()
  const [topic, setTopic] = useState({
    id: '',
    type: 0,
    title: [],
    options: [],
    answer: '',
  })
  useShareAppMessage(() => {
    return {
      title: '我觉得这道题你肯定会，帮帮我吧：）',
      path: `/pages/index/index?superior=${userInfo.openid}`,
    }
  })

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
    setVisible(true)
    await answer({
      random,
      qid: topic.id,
      type: qtype,
      right: val,
    })
    setDialogOptions({
      type: val ? 1 : 2,
      title: val ? '恭喜您答对了' : '很遗憾答错了',
      award: random,
      answersheet: userInfo.answersheet

    })
    nextQs() // 切换下一题
  }

  return (
    <View className='container'>
      <View className='body'>
        <View className='topic'>
          {qtype === 0 &&
            <View className='idiom-title'>
              {topic.title.map(item => <Text key={item}>{item === '?' ? '__' : item}</Text>)}
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
        <View className='btn-group'>
          <Button
            openType='share'
          >考考好友</Button>
          <View
            onClick={nextQs}
          >下一题</View>
        </View>
      </View>
      <View className='banner-ad'>
        <Ad
          unitId="adunit-effb4b2965cc8895"
          unit-id="adunit-effb4b2965cc8895"
          ad-intervals={60}></Ad>
      </View>
      <Dialog
        visible={visible}
        options={dialogOptions}
        close={() => setVisible(false)}>
      </Dialog>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '答题',
  navigationBarBackgroundColor: '#feab01'
}

export default observer(Index)