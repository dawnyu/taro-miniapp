import Taro, { useState, useContext } from '@tarojs/taro'
import { View, RadioGroup, Image, Radio, Button, Input, Form } from '@tarojs/components'
import { observer } from '@tarojs/mobx'
import store from '@/store/index'
import './index.scss'

function Index() {
  const { userInfo, update, config } = useContext(store) as any

  const formSubmit = async(e) => {
    const { phone, acount } = e.detail.value
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
    })
    Taro.showToast({
      title: '保存成功',
      icon: 'none',
      duration: 2000,
    }).then(() => {
      setTimeout(() => Taro.navigateBack({ delta: 1 }), 2000)
    })
    } catch (error) {
      Taro.showToast({
        title: error,
        icon: 'none',
        duration: 2000
      }).then(() => {
        setTimeout(() => Taro.navigateBack({ delta: 1 }), 2000)
      })
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
      {config.check === 0 &&
        <Button
          className='btn-center'
          onClick={setClipboardData}
          type='primary'
        >添加客服</Button>
      }
      {config.check === 1 &&
        <Form onSubmit={formSubmit} >
          <View className='item'>
            <View className='label'>
              收款方式
        </View>
            <Radio
              value='微信'
              disabled={true}
              checked={true}>
              <View className='radio'>
                <Image className='image' src='http://cdn.geekbuluo.com/%E5%BE%AE%E4%BF%A1.png' />
              </View>
            </Radio>
              {/* <Radio
                value='支付宝'
                checked={userInfo.alipay}
                disabled={userInfo.wechat}>
                <View className='radio'>
                  <Image className='image' src='http://cdn.geekbuluo.com/%E6%94%AF%E4%BB%98%E5%AE%9D.png' />
                </View>
              </Radio> */}
          </View>
          <View className='item'>
            <View className='label'>
              收款账号
        </View>
            <View className='right'>
              <Input
                type='text'
                name='acount'
                disabled={userInfo.wechat}
                value={userInfo.wechat}
                placeholderClass='placeholderClass'
                placeholder='接收红包微信账号'
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
                maxLength={11} />
            </View>
          </View>
          <View className='header-line'>重要说明</View>
          <View className='tip'>
            <View>1、用户积分兑换现金红包必须先设置收红包微信账号.</View>
            <View>2、填写微信号必须已实名.</View>
            <View>3、用户兑换话费充值卡必须填写需要充值的手机号码.</View>
            <View>4、微信号账号设置后不能修改，如需修改联系客服.</View>
          </View>
          <Button
            className='btn'
            formType='submit'
            type='primary'
          >提交</Button>
        </Form>
      }</View>
  )
}

Index.config = {
  navigationBarTitleText: '支付设置',
  navigationBarBackgroundColor: '#feab01'
}

export default observer(Index)