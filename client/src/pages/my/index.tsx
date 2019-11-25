import Taro, { useContext, useShareAppMessage, useState, useDidShow, useEffect } from '@tarojs/taro'
import { View, OpenData, Image, Text, Ad, Button } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import './index.scss'


let myVideoAd:any = null
let interstitialAd: any = null
function Index() {
  const { userInfo, check, transform } = useContext(store) as any
  const [transtModal, setTranstModal] = useState(false)
  useShareAppMessage(() => {
    return {
      title: '这个题好难啊，你能帮帮我吗？',
      path: `/pages/index/index?superior=${userInfo.openid}`,
      imageUrl: 'https://cdn.geekbuluo.com/20191101012651-min.jpg'
    }
  })
  useDidShow(() => {
    if (wx.createRewardedVideoAd && !myVideoAd) {
      myVideoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-e7665956d952b990',
      })
      myVideoAd.onLoad(() => {
        console.log('myVideoAd')
      })
      myVideoAd.onError((e) => {
        console.log(4, e)
       })
      myVideoAd.onClose(async (res) => {
        if (res && res.isEnded) {
          await transform()
          setTranstModal(false)
          Taro.showToast({
            title: '转换成功，赶紧去提现吧:)',
            icon: 'none' 
          })
        } else {
          Taro.showToast({
            title: '看完视频才能完成转换哦:)',
            icon: 'none'
          })
        }
      })
    }

    // 插屏
    if (wx.createInterstitialAd && !interstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-74b1032c62344261'
      })
      interstitialAd.onLoad(() => { })
      interstitialAd.onError((err) => { })
      interstitialAd.onClose(() => { })
    }

    setTimeout(() => {
      if (interstitialAd) {
        interstitialAd.show().catch((err) => {
          console.error(err)
        })
      }
    }, 300)
  })

  const toShowVideo = () => {
    if (myVideoAd) {
      myVideoAd.show().catch(() => {
        myVideoAd.load()
          .then(() => myVideoAd.show())
          .catch(() => { 
          })
      })
    }
  }
  const transtHandle = () => {
    setTranstModal(true)
  }
  
  return (
    <View className='container'>
      <View className='header'>
        <View className='user'>
          <View className='user-avatar'>
            <OpenData type='userAvatarUrl' />
          </View>
          <View className='user-nickname'>
            <OpenData type='userNickName' />
          </View>
        </View>
        {check && <View className='transt'>
          <View className='left'>
            <View>
              <View
                className='tip-pop'
                onClick={() => Taro.navigateTo({ url: '/pages/my/award/index' })}
              >收支详情</View>
              {userInfo.balance || 0}
            </View>
            <View>
              答题币余额
            </View>
          </View>
          <View className='center'>
            <View className='center-tip'>100币=1元</View>
            <Image
              className='center-arrow'
              src='https://cdn.geekbuluo.com/%E5%8F%B3%E7%AE%AD%E5%A4%B4.png' />
            <View
              className='center-btn'
              onClick={transtHandle}
            >立即转换</View>
          </View>
          <View className='right'>
            <View>
              <View
                className='tip-pop'
                onClick={() => Taro.navigateTo({ url: '/pages/my/drawcash/index' })}
              >立即提现</View>
              {userInfo.cash || '0.00'}
            </View>
            <View>可提现收益</View>
          </View>
        </View>
        }
        
        <View className='banner'>
          <View>剩余答题卡：{userInfo.answersheet || 0}</View>
          <View>剩余兑换卡：{userInfo.withdrawTime || 0}</View>
        </View>
      </View>
      <View className='body'>
        <View className='header-line'>限时福利</View>
        <View className='item'>
          <View className='left'>
            <View className='title'>邀请好友<Text className='tip'>（每天可多次完成）</Text></View>
            <View className='award'>+8答题币+10%好友提成+1兑换卡</View>
          </View>
          <Button
            className='btn'
            openType='share'>邀请</Button>
        </View>
        <View className='item'>
          <View className='left'>
            <View className='title'>每日签到</View>
            <View className='award'>连续签到越多奖励越多</View>
          </View>
          <Button
            className='btn'
            onClick={() => Taro.switchTab({ url: '/pages/mission/index' })}
          >去签到
          </Button>
        </View>
        <View className='banner-ad'>
          <Ad
            unitId="adunit-835fed49a77040b4"
            unit-id="adunit-835fed49a77040b4"
            ad-intervals={60}></Ad>
        </View>
        <View className='item'>
          <View className='left'>
            <View className='title'>兑换记录</View>
            <View className='explain'>兑换记录审核情况查看</View>
          </View>
          <Button
            className='btn'
            onClick={() => Taro.navigateTo({ url: '/pages/my/withdraw/index' })}>
              去查看
          </Button>
        </View>
      </View>
      {
        transtModal &&
        <View className='modal'>
          <View className='content'>
            <View className='mobal-body'>
              <View className='p1'>转换收益</View>
              <View className='p2'>答题币<Text>{userInfo.balance}</Text></View>
              <Image
                className='arrow'
                mode='aspectFit'
                src='https://cdn.geekbuluo.com/%E5%9B%BE%E5%B1%82%2044.png'></Image>
              <View className='p4'><Text>￥{userInfo.balance / 100}</Text>元</View>
            </View>
            <View
              className='trans-btn'
              onClick={toShowVideo}>看视频免费转换</View>
            <View
              onClick={() => setTranstModal(false)}
              className='close'>点击关闭</View>
          </View>
        </View>
      }
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '我的',
  navigationBarBackgroundColor: '#ff5748'
}

export default observer(Index)