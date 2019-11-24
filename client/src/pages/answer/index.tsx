import Taro, { useContext, useState, useDidShow, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Image, Button, Ad, RadioGroup, Radio } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import Dialog from '@/components/Dialog'
import store from '@/store/index'
import { getQs } from '@/service/cloud'
import './index.scss'

function Index() {
  const { answer, userInfo, qtype: initQtype, videoAd, setVideoAd } = useContext(store) as any
  useShareAppMessage(() => {
    return {
      title: '我觉得这道题你肯定会，帮帮我吧：）',
      path: `/pages/index/index?superior=${userInfo.openid}`,
    }
  })
  const [visible, setVisible] = useState(false)
  const [dialogOptions, setDialogOptions] = useState()
  const [topic, setTopic] = useState()
  const [carTopic, setCarTopic] = useState()
  const [qtype] = useState(initQtype)
  const [showVideo, setShowVideo] = useState(true)

  useDidShow(async () => {
    Taro.showLoading()
    try {
      await nextQs()
      Taro.hideLoading()
    } catch (error) {
      Taro.hideLoading()
    }
    if (wx.createRewardedVideoAd && !videoAd.answer) {
      let videoAd2 = wx.createRewardedVideoAd({
        adUnitId: 'adunit-915012dfd68e5b00',
      })
      videoAd2.onLoad(() => {
        console.log('videoAd load success')
        setShowVideo(true)
      })
      videoAd2.onError(() => {
        setShowVideo(false)
      })
      videoAd2.onClose(async (res) => {
        if (res && res.isEnded) {
          Taro.showToast({
            title: `额外获取的答题币1已到账:)`,
            icon: 'none'
          })
          closeModal()
        } else {
          Taro.showToast({
            title: '看完视频点击关闭按钮才能获得奖励哦:)',
            icon: 'none'
          })
        }
      })
      setVideoAd('answer', videoAd2)
    }
  })
  const toShowVideo = () => {
    videoAd.answer.show().catch(() => {
      videoAd.answer.load()
        .then(() => videoAd.answer.show())
        .catch(() => {
        })
    })
  }

  const nextQs = async() => {
    const carTopics = Taro.getStorageSync('carTopics')
    if (qtype === 2 && carTopics && carTopics.length > 1) {
      
      setCarTopic(carTopics[0])
      Taro.setStorage({
        key: 'carTopics',
        data: carTopics.slice(1)
      })
      return
    }
    const { data } = await getQs({ type: qtype })
    if (qtype === 0) {
      setTopic({
        ...data || []
      })
    } else if (qtype === 2) {
      setCarTopic(data[0])
      Taro.setStorage({
        key: 'carTopics',
        data: data.slice(1)
      })
    }
  }

  const answerHanle = async(val, qid) => {
    let random = 0
    if (userInfo.answersheet >= 0) {
      random = Math.round(Math.random() * 3) + 1
    }
    await answer({
      random,
      qid,
      type: qtype,
      right: val,
    })
    setDialogOptions({
      type: val ? 1 : 2,
      title: val ? '恭喜您答对了' : '很遗憾答错了',
      award: random,
      answersheet: userInfo.answersheet,
      toShowVideo,
      showVideo,
    })
    setVisible(true)
    nextQs() // 切换下一题
  }

  const closeModal = () => {
    setVisible(false)
    setDialogOptions({
      type: 0,
      title: '',
      award: '',
      answersheet: ''
    })
  }

  return (
    <View className='container'>
      <View className='body'>
        {qtype === 0 && 
          <View className='chengyu'>
            <View className='topic'>
              {topic && topic.title &&
                <View className='idiom-title'>
                  {topic.title.map(item => <Text key={item}>{item === '?' ? '__' : item}</Text>)}
                </View>}
            </View>
            {topic &&topic.options && 
              <View
                className='idiom-option'
              >
                {topic.options.map((item) =>
                  <Text
                    onClick={() => answerHanle(item === topic.answer, topic.id)}
                    key={item}>
                    {item}
                  </Text>
                )}
              </View>}
          </View>}
        {qtype === 2 &&
          <View className='jiakao'>
            <View className='topic'>
              <View className='idiom-title'>
                {carTopic && carTopic.title}
              </View>
              {
                carTopic.image && 
                <Image
                  mode='aspectFit'
                  className='idiom-image' src={carTopic.image}/>
              }
            </View>
            {
              carTopic && carTopic.classify === 0 && 
              <View className='options'>
                <View
                  onClick={() => answerHanle(1 === carTopic.right, carTopic.id)}
                  className='option-btn'>正确</View>
                <View
                  className='option-btn'
                  onClick={() => answerHanle(0 === carTopic.right, carTopic.id)}>错误</View>
              </View>
            }
            {carTopic && carTopic.classify === 1 &&
              <View
                className='idiom-option'
              >
            <RadioGroup
              onChange={(val) => answerHanle(val === carTopic.right, carTopic.id)}>
              {carTopic.options.split('|').map((item, index) =>
                <View className='radio-box' key={item}>
                  <Radio value={index}> {item} </Radio>
               </View>
              )}
            </RadioGroup>
              </View>}
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
        close={closeModal}>
      </Dialog>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '答题赚小钱',
  navigationBarBackgroundColor: '#feab01'
}

export default observer(Index)