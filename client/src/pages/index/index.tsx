import Taro, { useContext, useDidShow,
  useState, useEffect, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Image, Button, OpenData, Ad, Form } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import Good from '@/components/Good'
import { QuestionEnum } from '@/enum'
import { getUserinfo } from '@/utils'
import storage from '@/utils/storage'
import Dialog from '@/components/Dialog'
import topbg from '@/assets/images/topbg2.png'
import { systemTime, openRedEnvelope, typeinFormId } from '@/service/cloud'
import './index.scss'

let videoAd: any
function Index() {
  const {
    userInfo,
    getUser,
    qtype,
    goods,
    getGoods,
    login,
    getConfig,
    addAnswerSheet,
    check,
  } = useContext(store) as any
  useShareAppMessage(() => {
    return {
      title: '这个题好难啊，你能帮帮我吗？',
      path: `/pages/index/index?superior=${userInfo.openid}`,
      imageUrl: 'https://cdn.geekbuluo.com/20191101012651-min.jpg'
    }
  })

  const [showVideoAd, setShowVideoAd] = useState(false)
  const [firstScreen, setFirstScreen] = useState(false)
  const [countDown, setCountDown] = useState(0)
  const [balance, setBalance] = useState(0)
  const [countDownText, setCountDownText] = useState('')

  const [visible, setVisible] = useState(false)
  const [dialogOptions, setDialogOptions] = useState()

  const COUNTDOWN = 10 * 60

  useDidShow(async () => {
    getGoods()
    const user = await getUser()
    await getConfig()
    const firsthb = storage.get('firsthb')
    if (!user.data) {
      login({ superior: Taro.getStorageSync('superior') })
    }
    if (!firsthb) {
      setFirstScreen(true)
      storage.set('firsthb',true, 24 * 60)
    }
    setBalance(100)
    openRedEnvelopeHandle(false)
    if (wx.createRewardedVideoAd && !videoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-6ea9b38b4d7240a5',
      })
      videoAd.onLoad(() => {
        console.log('videoAd load success')
      })
      videoAd.onError(() => {})
      videoAd.onClose(async(res) => {
        if (res && res.isEnded) {
          await addAnswerSheet({ num: 1 })
          setDialogOptions({
            type: 4,
            title: '答题卡',
            text: '恭喜您获得1张答题卡',
          })
          setVisible(true)
        } else {
          Taro.showToast({
            title: '视频没有看完没有获取到答题卡哦:)',
            icon: 'none'
          })
        }
       })
       setShowVideoAd(true)
    }
  })

  const toShowVideo = () => {
    if (videoAd) {
      videoAd.show().catch(() => {
        videoAd.load()
          .then(() => videoAd.show())
          .catch(() => {
          })
      })
    }
  }

  useEffect(() => {
    function full(val) {
      return val < 10 ? `0${val}` : val
    }
    if (countDown) {
      countDownHandle()
    }
    function countDownHandle() {
      const m = Math.floor(countDown / 60) % 60
      const s = countDown % 60
      if (countDown <= 1) {
        setCountDownText('')
      } else {
        setCountDownText(`${full(m)}:${full(s)}`)
      }
    }
    let timer = setTimeout(() => {
      if (countDown > 0) {
        setCountDown((c: number) => c - 1)
        countDownHandle()
      }
    }, 1000)
    return () => {
      videoAd = null
      clearTimeout(timer)
    }
  }, [countDown])

  useEffect(() => {
    const temp = userInfo.balance < 30 ? 2 : Math.ceil(userInfo.balance / 30)
      if (balance < userInfo.balance) {
        setBalance((c: number) => c + temp)
      } else {
        setBalance(userInfo.balance)
      }
  }, [balance])

  const openRedEnvelopeHandle = async (click) => {
    const {data: current} = await systemTime()
    const lastTime = Taro.getStorageSync('countDownTime')
    if (click) {
      setCountDown(COUNTDOWN)
      Taro.setStorage({
        key: 'countDownTime',
        data: current
      })
      setVisible(true)
      setDialogOptions({
        type: 4,
        title: '答题卡',
        text: '恭喜您获得1张答题卡',
      })
      await addAnswerSheet({num: 1})
    } else if (lastTime && current - lastTime < COUNTDOWN * 1000) {
      setCountDown(COUNTDOWN - Math.floor((current - lastTime) / 1000))
    }
  }

  //关闭红包授权
  const closeOpenHandle = (userinfo) => {
    getUserinfo(userinfo, async () => {
      const { data, message, status } = await openRedEnvelope()
      if (status === 0) {
        setFirstScreen(false)
        setVisible(true)
        setDialogOptions({
          type: 4,
          title: '答题币',
          text: `恭喜您获得${data}答题币`,
        })
        getUser()
      } else {
        Taro.showToast({
          title: message,
          icon: 'none'
        })
      }
    })
  }

  const formSubmit = (e) => {
    const { formId } = e.detail
    typeinFormId({ formId })
    Taro.navigateTo({ url: '/pages/answer/index' })
  }

  const closeModal = () => {
    setVisible(false)
    setDialogOptions({
      type: 0,
      title: '',
      text: '',
    })
  }

  return (
    <View className='container'>
      <View className='header'>
        {check ?
          <View className='user-balance'>
            <View className='userAvatarUrl'><OpenData type='userAvatarUrl' /></View>
          <Text className='user-balance-value'>￥{userInfo.cash || '0.00'}元</Text>
        </View> : <View></View>}
        <View>
          <View
            className='switch'
            onClick={() => Taro.navigateTo({url: '/pages/questionBank/index'})}
          >{QuestionEnum[qtype]}<Text className='iconfont icon-arrow-right' /></View>
        </View>
      </View>
      <View className='content'>
        <View className='red-packet'>
          <Image
            mode='aspectFit'
            className='top-bg'
            src={topbg}/>
          <View className='residue'>
            <View className='coin'>{balance}</View>
            <View className='coin-label'>答题币</View>
          </View>
          <View className='answersheet'>剩余答题卡 {userInfo.answersheet}</View>
          <View className='red-packet-btn'>
            <Form report-submit={true} onSubmit={formSubmit}>
              <Button
                className='answer-_btn'
                formType="submit"/>
            </Form>
          </View>
          <View className='floaticon'>
            <View>
              <View className='qipao sign-qipao'>
                <Image
                  className='sign'
                  onClick={toShowVideo}
                  mode='aspectFit'
                  src='https://cdn.geekbuluo.com/video.png'/>
              </View>
              <Text className='sign-text'>攒答题卡</Text>
            </View>
            <View className='qipao open-red-qipao'>
              <Image
                className='open-red'
                mode='aspectFit'
                onClick={() => openRedEnvelopeHandle(countDown === 0)}
                src='https://cdn.geekbuluo.com/smallhongbao-min.png' />
            </View>
            <View className='open-red-text'> {countDownText || '开红包'}</View>
            <View className='qipao rank-qipao'>
              <Image
                className='rank'
                mode='aspectFit'
                onClick={() => Taro.navigateTo({ url: '/pages/rank/index' })}
                src='https://cdn.geekbuluo.com/paihangbang-min.png' />
            </View>
            <Text className='rank-text'>排行榜</Text>
            <View className='qipao share-qipao'>
              <Button
                className='share'
                openType='share'>
                <Image
                  className='friend'
                  mode='aspectFit'
                  src='https://cdn.geekbuluo.com/coin-min.png'/>
              </Button>
            </View>
            {check ? <Text className='share-text'>攒兑换卡</Text> :
              <Text className='share-text'>考考好友</Text>}
          </View>
        </View>
        <View className='banner-ad'>
          <Ad
            unitId="adunit-e77dadb2eafec124"
            unit-id="adunit-e77dadb2eafec124"
            ad-intervals={60}></Ad>
        </View>
        {check && <View className='header-line'>免费兑换</View>}
        {check && <View className='red-packet-convert'>
          {
            goods.map((item, index) =>
              <Good key={index} data={item} />)
          }
        </View>
        }
        
      </View>
     {
      firstScreen && 
      <View className='first-screen'>
        <Text className='text'>幸运奖励</Text>
        {/* <Text className='text1'>最高获得20答题币</Text> */}
        <Button
          openType='getUserInfo'
          onGetUserInfo={closeOpenHandle}
          type='primary'
          lang='zh_CN'/>
        <View
          className='close-first-screen'
            onClick={() => setFirstScreen(false)}>点击关闭</View>
      </View>
     }
      <Dialog
        visible={visible}
        options={dialogOptions}
        close={closeModal}>
      </Dialog>
    </View>
  )
}
Index.config = {
  disableScroll: true,
  navigationBarBackgroundColor: '#fff',
  navigationBarTextStyle: 'black'
}

export default observer(Index)