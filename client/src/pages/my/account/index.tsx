import Taro, { useState, useContext } from '@tarojs/taro'
import { View, Button, Input, Form } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import TaroRegionPicker from '@/components/region-picker'
import './index.scss'

function Index() {
  const { userInfo, update, config } = useContext(store) as any
  const [address, setAddress] = useState(userInfo.address && userInfo.address.split('--')[1])
  const [city, setCity] = useState(userInfo.address && userInfo.address.split('--')[0])
  const onGetRegion = (val) => {
    setCity(val)
    setAddress('')
  }
  const formSubmit = async(e) => {
    const { phone, acount, address } = e.detail.value
    if (acount === '') {
      Taro.showToast({
        title: `微信号不能为空`,
        icon: 'none',
        duration: 2000
      })
      return
    }

    Taro.showLoading({
      title: '提交中'
    })
    try {
    await update({
      id: userInfo.id,
      wechat: acount,
      phone,
      address: `${city}--${address}`
    })
    Taro.showToast({
      title: '保存成功',
      icon: 'none',
      duration: 2000,
    }).then(() => {
      const timer = setTimeout(() => {
        clearTimeout(timer)
        Taro.navigateBack({ delta: 1 })
      }, 2000)
    })
    } catch (error) {
      Taro.showToast({
        title: error,
        icon: 'none',
        duration: 2000
      }).then(() => Taro.navigateBack({ delta: 1 }))
    }
  }
  const setClipboardData = () => {
    Taro.showModal({
      title: '温馨提示',
      content: '微信号复制成功，请添加客服微信，审核您的兑换订单',
      confirmText: '我知道了',
      confirmColor: 'red',
    })
    Taro.setClipboardData({
      data: 'dawning_yu',
    }).then(() => {
      Taro.hideToast()
    })
  }

  return (
    <View className='container'>
        <Form onSubmit={formSubmit} >
          <View className='item'>
            <View className='label'>
              微信号
        </View>
            <View className='right'>
              <Input
                type='text'
                name='acount'
                disabled={userInfo.wechat}
                value={userInfo.wechat}
                placeholderClass='placeholderClass'
                placeholder='请填写正确的微信号'
                maxLength={100} />
            </View>
          </View>
          <View className='item'>
            <View className='label'>
              手机号码
            </View>
            <View className='right'>
              <Input
                type='text'
                name='phone'
                value={userInfo.phone}
                className="input"
                placeholderClass='placeholderClass'
                placeholder='兑换话费充值卡必填'
                maxLength={11} />
            </View>
          </View>
          <View className='item'>
          <View className='label'>
            收货地址
          </View>
          <View className='right'>
            <TaroRegionPicker
            city={city}
            onGetRegion={onGetRegion} />
          </View>
          </View>
          <View className='item'>
          <View className='label'>
          </View>
          <View className='right'> 
            <Input
              type='text'
              name='address'
              value={address}
              className="input"
              placeholderClass='placeholderClass'
              placeholder='填写收货详细地址'
              maxLength={200} /></View>
           
          </View>
          <View className='header-line'>重要说明</View>
          <View className='tip'>
            <View>1、用户{config.unit}兑换虚拟礼品须先设置微信号。</View>
            <View>2、微信号必须已实名。</View>
            <View>3、兑换话费须填写手机号码。</View>
            <View>4、兑换实物好礼须填写收货地址。</View>
            <View>5、微信号设置后不能修改，如需修改联系客服。</View>
          </View>
          <Button
            className='btn'
            formType='submit'
            type='primary'
          >提交</Button>
        </Form>
      </View>
  )
}

Index.config = {
  navigationBarTitleText: '账号设置',
  navigationBarBackgroundColor: '#feab01'
}

export default observer(Index)