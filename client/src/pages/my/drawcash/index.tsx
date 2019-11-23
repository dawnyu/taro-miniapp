import Taro, {
  useContext,
  useState,
} from '@tarojs/taro'
import { View, Text, Button, Ad, Picker } from '@tarojs/components'
import { AtModal } from 'taro-ui'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import './index.scss'
async function Index() {
  const { userInfo, config, drawcash } = useContext(store) as any
  const [money, setMoney] = useState(1)
  const [modal, setModal] = useState({
    show: false,
    title: '',
    text: ''
  })
  const select = [1, 5, 10]
  const submit = async() => {
    if (userInfo.withdrawTime < money) {
      Taro.showToast({
        title: '兑换卡不足哦',
        icon: 'none'
      })
    } else {
      try {
        await drawcash({ money })
        setModal({
          show: true,
          title: '提现成功',
          text: '提现金额将于3到5个工作日发放，请留意收款通知'
        })
      } catch (error) {
        Taro.showToast({
          title: error.message,
          icon: 'none'
        })
      }
    }
  }
  return (
    <View className='container'>
      <View className='header'>
        <View className='cash'>￥<Text>{userInfo.cash || '0.00'}</Text>元</View>
        <View className='cash-label'>我的收益</View>
      </View>
      <View className='box'>
        <View className='b-title'>提现金额</View>
        <Picker
          mode='selector'
          value={select.indexOf(money)}
          range={select}
          onChange={e => setMoney(select[e.detail.value])}>
          <View className='picker'>
            ￥{money}元
            <Text className='iconfont icon-arrow-down'/>
        </View>
        </Picker>
        <View className='tip'>使用{money}张兑换卡</View>
         <Button
            className='submit-btn friend'
            type='primary'
            lang='zh_CN'
          >邀请好友得兑换卡</Button>
          <Button
            className='submit-btn'
            type='primary'
            lang='zh_CN'
            onClick={submit}
          >提现</Button>
        <Ad
          unitId="adunit-b023d9053cccbda2"
          unit-id="adunit-b023d9053cccbda2"
          ad-intervals={60}></Ad>
      </View>
      <AtModal
        isOpened={modal.show}
        closeOnClickOverlay
      >
        {
          <View className='atmodal-content'>
            <View className='atmodal-content-label'>
              <View className='atmodal-content-label-title'>
                {modal.title}
              </View>
              <View className='atmodal-content-label-text'>
                {modal.text}
              </View>
            </View>
            <View>
              <Ad
                unitId="adunit-effb4b2965cc8895"
                unit-id="adunit-effb4b2965cc8895"
                ad-intervals={60}></Ad>
            </View>
            <View
              onClick={() => setModal({ show: false, text: '', title: '' })}
              className='modal-close' >点击关闭</View>
          </View>}
      </AtModal>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '',
  navigationBarBackgroundColor: '#feab01'
}

export default observer(Index)