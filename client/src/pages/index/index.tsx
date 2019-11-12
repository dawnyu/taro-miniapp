import Taro, { useContext, useDidShow,
  useState, useEffect, useShareAppMessage } from '@tarojs/taro'
import { View, Text, Image, Button, OpenData, Ad } from '@tarojs/components'
import { AtModal } from 'taro-ui'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import Good from '@/components/Good'
import { QuestionEnum, TradeEnum } from '@/enum'
import { getUserinfo } from '@/utils'
import moment from 'moment'
import hongbao1 from '@/assets/images/hongbao1.png'
import hongbao2 from '@/assets/images/hongbao2.png'
import feidie from '@/assets/images/feidie-min.png'
import qiandao from '@/assets/images/qiandao.png'
import { systemTime, openRedEnvelope } from '@/service/cloud'
import './index.scss'

let videoAd: any
function Index() {
  const {
    userInfo,
    getUser,
    qtype,
    goods,
    getGoods,
    trade,
    login,
    getConfig,
    addAnswerSheet,
    config,
  } = useContext(store) as any
  useShareAppMessage(() => {
    return {
      title: '这个题好难啊，你能帮帮我吗？',
      path: `/pages/index/index?superior=${userInfo.openid}`,
      imageUrl: 'https://cdn.geekbuluo.com/20191101012651-min.jpg'
    }
  })

  const [showOpenRedEnvelopeModal, setShowOpenRedEnvelopeModal] = useState(false)
  const [firstScreen, setFirstScreen] = useState(false)
  const [award, setAward] = useState(0)
  const [countDown, setCountDown] = useState(0)
  const [countDownText, setCountDownText] = useState('')
  const COUNTDOWN =2 * 60 * 60

  useDidShow(async () => {
    getGoods()
    const config = await getConfig()
    const user = await getUser()
    const isAuth = Taro.getStorageSync('isAuth')
    if (!user.data) {
      //如果用户不存在
      login({ superior: Taro.getStorageSync('superior') }) //创建临时用户，只有openid
    }
    const isNewUser = config.open === 0 && !isAuth && !user.userid
    if (isNewUser) {
      const firsthb = await Taro.getStorageSync('firsthb')
      if (firsthb && !moment(firsthb).isSame(new Date(), 'day')) {
        setFirstScreen(true)
        Taro.setStorage({ key: 'firsthb', data: '' })
      } else if (!firsthb) {
        setFirstScreen(true)
      }
    }
    openRedEnvelopeHandle(false)
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-6ea9b38b4d7240a5'
      })
      videoAd.onLoad(() => { })
      videoAd.onError((err) => { })
      videoAd.onClose(async(res) => {
        console.log('播放完成', res.isEnded)
        if (res && res.isEnded) {
          await addAnswerSheet()
          Taro.showToast({
            title: '获取3张答题卡'
          })
          
        } else {
          // 播放中途退出，不下发游戏奖励
        }
       })
    }
  })

  const toShowVideo = () => {
    console.log(33, videoAd)
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
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
      setAward(+redPack)
      setShowOpenRedEnvelopeModal(true)
      trade({ id: userInfo._id, type: TradeEnum.定时红包, value: redPack })
    } else if (lastTime && current - lastTime < COUNTDOWN * 1000) {
      setCountDown(COUNTDOWN - Math.floor((current - lastTime) / 1000))
    }
  }
  const closeFirstScreen = () => {
    setFirstScreen(false)
    Taro.setStorageSync('firsthb', moment().format('YYYY-MM-DD HH:mm:ss'))
  }

  //关闭红包授权
  const closeOpenHandle = (userinfo) => {
    getUserinfo(userinfo, async () => {
      const { data, message, status } = await openRedEnvelope()
      if (status === 0) {
        setAward(data)
        setFirstScreen(false)
        setShowOpenRedEnvelopeModal(true)
        getUser()
      } else {
        Taro.showToast({
          title: message,
          icon: 'none'
        })
      }

    })
  }

  return (
    <View className='container'>
      <View className='header'>
        <View className='user-balance'>
          <View className='userAvatarUrl'><OpenData type='userAvatarUrl'/></View>
          <Text className='user-balance-value'>{userInfo.balance}</Text>{config.unit}
        </View>
      </View>
      <View className='content'>
        <View className='red-packet'>
          <Image
            className='red-packet-front'
            mode='scaleToFill'
            src={hongbao1}
          />
          <View className='red-packet-body'>
            <View className='residue'>当前答题卡<Text>{userInfo.answersheet}</Text>张</View>
          </View>
          <Image
            className='red-packet-bg'
            mode='scaleToFill'
            src={hongbao2}
          />
          <View className='red-packet-btn'>
            <Image
              className='answer-_btn'
              onClick={() => Taro.navigateTo({ url: '/pages/answer/index' })}
              src='https://cdn.geekbuluo.com/button-min.png' />
            <View className='topic-info'>
              <Text className='topic-title'>{QuestionEnum[qtype]}</Text>
              <View
                onClick={() => Taro.navigateTo({ url: '/pages/questionBank/index' })}
                className='topic-switch'
              >
                切换<Text className='iconfont icon-arrow-right' />
              </View>
            </View>
          </View>
         
         {
            config.check1 === 1 && <View className='floaticon'>
              <Image
                className='sign'
                onClick={toShowVideo}
                src='https://cdn.geekbuluo.com/A218.png' />
                <Text className='sign-text'>观看视频</Text>
              <Image
                className={countDown > 0 ? 'open-red' : 'open-red open-red-animate'}
                onClick={() => openRedEnvelopeHandle(countDown === 0)}
                src='https://cdn.geekbuluo.com/smallhongbao-min.png' />
              {!countDownText && <Text className='open-red-text'>拆我呀</Text>}
              {countDownText && <View className='red-packet-countdown'> {countDownText} </View>}

              <Image
                className='rank'
                onClick={() => Taro.navigateTo({ url: '/pages/rank/index' })}
                src='https://cdn.geekbuluo.com/paihangbang-min.png' />
              <Text className='rank-text'>排行榜</Text>

              <Button
                className='share'
                openType='share'>
                <Image
                  className='friend'
                  src='https://cdn.geekbuluo.com/1bf360a2147943ed1bb863e4f607979a-min.png' />
              </Button>
              <Text className='friend-text'>攒兑换卡</Text>
            </View>
         }
        </View>
        <View className='banner-ad'>
          <Ad
            unitId="adunit-e77dadb2eafec124"
            unit-id="adunit-e77dadb2eafec124"
            ad-intervals={60}></Ad>
        </View>
        {config.check1 === 1 &&  <View className='header-line'>0元免费换</View>}
        {config.check1 === 1 &&  <View className='red-packet-convert'>
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
            hover-class='nav-item-hover'
          >
            <Image src={qiandao} />
            <View>签到</View>
          </View>
          <View
            onClick={() => Taro.navigateTo({ url: '/pages/friends/index' })}
            className='nav-item'
            hover-class='nav-item-hover'
          >
            <Image src='https://cdn.geekbuluo.com/1bf360a2147943ed1bb863e4f607979a-min.png' />
            <View>好友</View>
          </View>
          <View
            onClick={() => Taro.navigateTo({ url: '/pages/my/index' })}
            className='nav-item'
            hover-class='nav-item-hover'
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
          <Text className='text'>幸运奖励</Text>
          <Text className='text1'>最高获得20{config.unit}</Text>
          <Button
            openType='getUserInfo'
            onGetUserInfo={closeOpenHandle}
            type='primary'
            lang='zh_CN'
          />
          <View
            className='close-first-screen'
            onClick={() => closeFirstScreen()}>点击关闭</View>
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
                  恭喜您获得<Text>{award}</Text>{config.unit}
              </View>
            </View>
            <View
              onClick={() => setShowOpenRedEnvelopeModal(false)}
              className='modal-close'>点击关闭</View>
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