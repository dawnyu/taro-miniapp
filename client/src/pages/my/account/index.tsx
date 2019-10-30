import Taro, { useState, useContext } from '@tarojs/taro'
import { View, RadioGroup, Image, Radio, Button, Input, Form } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import './index.scss'

function Index() {
  const { userInfo, update } = useContext(store) as any
  const [placeholder, setPlaceholder] = useState('接收红包微信账号')
  const onChange = (val) => {
    setPlaceholder(`接收红包${val.currentTarget.value}账号`)
  }

  const formSubmit = async(e) => {
    const { phone, acount, type } = e.detail.value
    if (type === '') {
      Taro.showToast({
        title: '请选择收款方式',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (acount === '') {
      Taro.showToast({
        title: `${type}账号不能为空`,
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
      wechat: type === '微信' ? acount : '',
      alipay: type === '支付宝' ? acount : '',
      phone,
    })
    await Taro.showToast({
      title: '保存成功',
      icon: 'none',
      duration: 2000
    })
    Taro.hideLoading()
    Taro.navigateBack({ delta: 1 })
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({
        title: error,
        icon: 'none',
        duration: 2000
      })
    }
  }

  return (
    <View className='container'>
      <Form onSubmit={formSubmit} >
      <View className='item'>
        <View className='label'>
          收款方式
        </View>
        <RadioGroup
          onChange={onChange}
          name='type'>
          <Radio
            value='微信'
            disabled={userInfo.wechat || userInfo.alipay}
            checked={userInfo.wechat}>
            <View className='radio'>
              <Image className='image' src='http://cdn.geekbuluo.com/%E5%BE%AE%E4%BF%A1.png' />
          </View>
          </Radio>
          <Radio
            value='支付宝'
            checked={userInfo.alipay}
            disabled={userInfo.wechat || userInfo.alipay}>
            <View className='radio'>
              <Image className='image' src='http://cdn.geekbuluo.com/%E6%94%AF%E4%BB%98%E5%AE%9D.png' />
            </View>
          </Radio>
        </RadioGroup>
      </View>
      <View className='item'>
        <View className='label'>
           收款账号 
        </View>
        <View className='right'>
         <Input
          type='text'
          name='acount'
          disabled={userInfo.wechat || userInfo.alipay}
          value={userInfo.wechat || userInfo.alipay}
          placeholderClass='placeholderClass'
          placeholder={placeholder}
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
            placeholderClass='placeholderClass'
            placeholder='兑换话费必填'
            maxLength={11}/>
        </View>
      </View>
      <View className='header-line'>重要说明</View>
      <View className='tip'>
        <View>1、用户答题币兑换现金红包必须先设置收红包账号.</View>
        <View>2、填写微信号或支付宝号必须已实名.</View>
        <View>3、用户兑换话费充值卡必须填写需要充值的手机号码.</View>
        <View>4、微信号或者支付宝账号设置后不能修改，如需修改联系客服.</View>
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
  navigationBarTitleText: '支付设置',
  navigationBarBackgroundColor: '#feab01'
}

export default observer(Index)