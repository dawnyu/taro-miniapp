import Taro, { useContext, useDidShow,
  useState, useEffect, useRouter, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Image, Button, OpenData } from '@tarojs/components'
import { AtModal } from 'taro-ui'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import Good from '@/components/Good'
import { QuestionEnum, TradeEnum } from '@/enum'
import hongbao1 from '@/assets/images/hongbao1.png'
import hongbao2 from '@/assets/images/hongbao2.png'
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
    goods,
    getGoods,
    trade,
  } = useContext(store) as any
  useShareAppMessage(() => {
    return {
      title: '这个题好难啊，你能帮帮我吗？',
      path: `/pages/index/index?superior=${userInfo.openid}`,
      imageUrl: 'http://cdn.geekbuluo.com/share_image%20%281%29.jpg'
    }
  })

  const [showOpenRedEnvelopeModal, setShowOpenRedEnvelopeModal] = useState(false)
  const [firstScreen, setFirstScreen] = useState(false)
  const [openRedEnvelope, setOpenRedEnvelope] = useState(0)

  const [countDown, setCountDown] = useState(0)
  const [countDownText, setCountDownText] = useState('')
  const COUNTDOWN =2 * 60 * 60

  const router:any = useRouter()

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
      const redPack = Math.floor(1 + Math.random() * 5)
      setOpenRedEnvelope(+redPack)
      setShowOpenRedEnvelopeModal(true)
      trade({ id: userInfo._id, type: TradeEnum.定时红包, value: redPack })
    } else if (lastTime && current - lastTime < COUNTDOWN * 1000) {
      setCountDown(COUNTDOWN - Math.floor((current - lastTime) / 1000))
    }
  }

  useDidShow(async () => {
    const user = await getUser()
    setFirstScreen(!user.id)
    getGoods()
    openRedEnvelopeHandle(false)
  })

  const getUserinfo = async({ detail }) => {
    const redPack = Math.floor(1 + Math.random() * 0.2 * 100)
    setFirstScreen(false)
    setOpenRedEnvelope(+redPack)
    setShowOpenRedEnvelopeModal(true)
    await login({ ...detail.userInfo })
    trade({ id: userInfo._id, superior: router.superior, type: TradeEnum.开门红包, value: redPack })
  }

  return (
    <View className='container'>
      <View className='header'>
        <View className='user-balance'>
          <View className='userAvatarUrl'><OpenData type='userAvatarUrl'/></View>
          <Text className='user-balance-value'>{userInfo.balance}</Text>答题币
        </View>
      </View>
      <View className='content'>
        <View className='red-packet'>
          <Image
            className='red-packet-front'
            src={hongbao1}
          />
          <View className='red-packet-body'>
            <View className='residue'>当前答题卡<Text>{userInfo.answersheet}</Text></View>
          </View>
          <Image
            className='red-packet-bg'
            src={hongbao2}
          />
          <View className='red-packet-btn'>
            <Image
              className='answer-_btn'
              onClick={() => Taro.navigateTo({ url: '/pages/answer/index' })}
              src='http://cdn.geekbuluo.com/button-min.png' />
            <View className='topic-info'>
              <Text className='topic-title'>{QuestionEnum[qtype]}</Text>
              <View
                onClick={() => Taro.navigateTo({ url: '/pages/questionBank/index' })}
                className='topic-switch'
              >
                切换<Text className='at-icon at-icon-chevron-right' />
              </View>
            </View>
          </View>
         
          <View className='floaticon'>
            <Image
              className='sign'
              onClick={() => Taro.navigateTo({ url: '/pages/mission/index' })}
              src='http://cdn.geekbuluo.com/qiandao1-min.png' />

            <Image
              className={countDown > 0 ? 'open-red' : 'open-red open-red-animate'}
              onClick={() => openRedEnvelopeHandle(countDown === 0)}
              src='http://cdn.geekbuluo.com/smallhongbao-min.png'/>
            {!countDownText && <Text className='open-red-text'>开红包</Text>}
            {countDownText && <View className='red-packet-countdown'> {countDownText} </View>}

            <Image
              className='rank'
              onClick={() => Taro.navigateTo({ url: '/pages/rank/index' })}
              src='http://cdn.geekbuluo.com/paihangbang-min.png'/>
            <Text className='rank-text'>排行榜</Text>

            <Image
              className='friend'
              onClick={() => Taro.navigateTo({ url: '/pages/rank/index' })}
              src='http://cdn.geekbuluo.com/1bf360a2147943ed1bb863e4f607979a-min.png' />
            <Text className='friend-text'>赚答题卡</Text>
          </View>
        </View>
        {goods && goods.length > 0 &&  <View className='header-line'>0元免费换</View>}
          {<View className='red-packet-convert'>
            {
              goods.map(item =>
              <Good key={item.id} data={item} />)
            }
          </View>
        }
        
      </View>
      <View className='nav'>
        <View
          onClick={() => Taro.navigateTo({ url: '/pages/mission/index' })}
          className='nav-item'
        >
          <Image src={qiandao} />
          <View>签到</View>
        </View>
        <View
          onClick={() => Taro.navigateTo({ url: '/pages/friends/index' })}
          className='nav-item'
        >
          <Image src='http://cdn.geekbuluo.com/1bf360a2147943ed1bb863e4f607979a-min.png' />
          <View>好友</View>
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
              <View className='atmodal-content-label-text'>
                  恭喜您获得<Text>{openRedEnvelope}</Text>答题币
              </View>
            </View>
            <View
              onClick={() => setShowOpenRedEnvelopeModal(false)}
              className='at-icon at-icon-close'/>
          </View>}
      </AtModal>
     }
    </View>
  )
}
Index.config = {
  disableScroll: true,
  navigationBarBackgroundColor: '#feab01'
}

export default observer(Index)