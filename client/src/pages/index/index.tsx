import Taro, { useContext, useDidShow, useState, useEffect } from '@tarojs/taro'
import { View, Text, Image, Button, OpenData } from '@tarojs/components'
import { AtModal } from 'taro-ui'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import RedPacket from '@/components/RedPacket'
import Goods from '@/components/Goods'
import { QuestionEnum, TradeEnum } from '@/enum'
import hongbao1 from '@/assets/images/hongbao1.png'
import hongbao2 from '@/assets/images/hongbao2.png'
import hongbaomin from '@/assets/images/hongbao-min.png'
import feidie from '@/assets/images/feidie-min.png'
import qiandao from '@/assets/images/qiandao.png'
import { systemTime } from '@/service/cloud'
import './index.scss'

function Index() {
  const {
    userInfo,
    login,
    getUser,
    qtype,
    redPacket,
    getRedPackets,
    trade,
  } = useContext(store) as any

  const [showOpenRedEnvelopeModal, setShowOpenRedEnvelopeModal] = useState(false)
  const [firstScreen, setFirstScreen] = useState(false)
  const [openRedEnvelope, setOpenRedEnvelope] = useState(0)

  const [countDown, setCountDown] = useState()
  const [countDownText, setCountDownText] = useState('')
  const COUNTDOWN = 10

  useEffect(() => {
    function full(val) {
      return val < 10 ? `0${val}` : val
    }
    if (countDown) {
      countDownHandle()
    }
    function countDownHandle() {
      const h = Math.floor(countDown / 60 / 60)
      const m = Math.floor(countDown / 60) % 60
      const s = countDown % 60
      if (countDown <= 1) {
        setCountDownText('')
      } else {
        setCountDownText(`${full(h)}:${full(m)}:${full(s)}`)
      }
    }
    let timer = setTimeout(() => {
      if (countDown > 0) {
        setCountDown((c: number) => c - 1)
        countDownHandle()
      }
    }, 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [countDown])

  const openRedEnvelopeHandle = async (click) => {
    const {data: current} = await systemTime()
    const lastTime = Taro.getStorageSync('countDownTime')
    if (click) {
      setCountDown(COUNTDOWN)
      Taro.setStorage({
        key: 'countDownTime',
        data: current
      })
      const redPack = Math.floor(Math.random() * 10)
      setOpenRedEnvelope(+redPack)
      setShowOpenRedEnvelopeModal(true)
    } else if (lastTime && current - lastTime < COUNTDOWN * 1000) {
      setCountDown(COUNTDOWN - Math.floor((current - lastTime) / 1000))
    }
  }

  useDidShow(async () => {
    const user = await getUser()
    setFirstScreen(!user.id)
    getRedPackets()
    openRedEnvelopeHandle(false)
  })

  const getUserinfo = async({ detail }) => {
    const redPack = Math.random() * 0.3 * 100
    setFirstScreen(false)
    setOpenRedEnvelope(+redPack)
    setShowOpenRedEnvelopeModal(true)
    await login({ ...detail.userInfo })
    trade({ id: userInfo._id, type: TradeEnum.开门红包, value: redPack })
  }

  return (
    <View className='container'>
      <View className='header'>
        <View className='user-info'>
          <View className='user-avatar'>
            <OpenData type='userAvatarUrl' />
          </View>
          <View>
            <View className='user-nickname'>
              <OpenData type='userNickName' /></View>
            <View className='topic-info'>
              <Text className='topic-title'>{QuestionEnum[qtype]}</Text>
              <View
                onClick={() => Taro.navigateTo({url: '/pages/questionBank/index'})}
                className='topic-switch'
              >
                切换<Text className='at-icon at-icon-chevron-right' />
              </View>
            </View>
          </View>
        </View>
        <View className='user-balance'>
          <View className='user-balance-bottom'>
            <Text className='iconfont icon-yuanbao' />
            <Text className='user-balance-value'>{userInfo.balance}</Text>
          </View>
        </View>
      </View>
      <View className='content'>
        <View className='red-packet'>
          <Image
            className='red-packet-front'
            src={hongbao1}
          />
          <View
            className='red-packet-body'
          >
          </View>
          {!countDownText && 
          <View className='red-packet-open'>
            <Text
              onClick={() => openRedEnvelopeHandle(true)}
              className='packet-open'>
                开
            </Text>
          </View>}
          {countDownText && 
            <View className='red-packet-countdown'>
              {countDownText}
            </View>}
          <Image
            className='red-packet-bg'
            src={hongbao2}
          />
          <View className='red-packet-btn'>
            <View className='residue'>剩余答题卡<Text>{userInfo.answersheet}</Text>张</View>
            <Button
              onClick={() => Taro.navigateTo({url: '/pages/answer/index'})}
              className='answer-_btn'
            >立即答题</Button>
          </View>
        </View>
        <View className='header-line'>现金红包兑换</View>
        <View className='red-packet-convert'>
          {
            redPacket.map(item =>
              <RedPacket key={item.id} data={item} />)
          }
        </View>
        <View className='header-line'>商品兑换</View>
        <View className='red-packet-convert'>
          <Goods />
        </View>
      </View>
      <View className='nav'>
        <View
          onClick={() => Taro.navigateTo({ url: '/pages/rank/index'})}
          className='nav-item'
        >
          <Image src={hongbaomin} />
          <View>排行榜</View>
        </View>
        <View
          className='nav-item'
        >
          <Image src={qiandao} />
          <View>签到</View>
        </View>
        <View
          onClick={() => Taro.navigateTo({ url: '/pages/my/index' })}
          className='nav-item'
        >
          <Image src={feidie} />
          <View>我的</View>
        </View>
      </View>
     {
        firstScreen && 
        <View
          className='first-screen'
        >
          <Image src='http://cdn.geekbuluo.com/kaimen.png' />
          <Button
            openType='getUserInfo'
            onGetUserInfo={getUserinfo}
            type='primary'
            lang='zh_CN'
          />
        </View>
     }
     {
      <AtModal
        isOpened={showOpenRedEnvelopeModal}
        closeOnClickOverlay
      >
        {
          <View className='atmodal-content'>
            <View className='atmodal-content-label'>
              <View>{openRedEnvelope}<Text className='iconfont icon-yuanbao'></Text></View>
            </View>
            <View
              onClick={() => setShowOpenRedEnvelopeModal(false)}
              className='modal-close'
            >
            </View>
          </View>}
      </AtModal>
     }
    </View>
  )
}
Index.config = {
  disableScroll: true,
}

export default observer(Index)