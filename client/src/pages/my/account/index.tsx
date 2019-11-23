import Taro, { useState, useContext } from '@tarojs/taro'
import { View, Button, Input, Form } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import TaroRegionPicker from '@/components/region-picker'
import './index.scss'

function Index() {
  const { userInfo, update } = useContext(store) as any
  const [address, setAddress] = useState(userInfo.address && userInfo.address.split('--')[1])
  const [city, setCity] = useState(userInfo.address && userInfo.address.split('--')[0])
  const onGetRegion = (val) => {
    setCity(val)
    setAddress('')
  }
  const formSubmit = async(e) => {
    const { phone, address } = e.detail.value

    Taro.showLoading({
      title: '提交中'
    })
    try {
    await update({
      id: userInfo.id,
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

  return (
    <View className='container'>
        <Form onSubmit={formSubmit} >
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
            <View>1、兑换话费必须填写手机号码。</View>
            <View>2、兑换实物好礼必须填写收货地址。</View>
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
  navigationBarTitleText: '基本设置',
  navigationBarBackgroundColor: '#feab01'
}

export default observer(Index)