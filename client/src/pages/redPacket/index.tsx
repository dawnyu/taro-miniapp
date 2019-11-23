import Taro, { useRouter, useDidShow, useState, useContext } from '@tarojs/taro'
import store from '@/store/index'
import { observer } from '@tarojs/mobx'
import { View, Text, Image, Button, OpenData, Ad, Input } from '@tarojs/components'
import { getGood } from '@/service/cloud'

import './index.scss'

function RedPacket() {
  const { userInfo, trade, config, update } = useContext(store) as any
  const router = useRouter()
  const [details, setDetails] = useState()
  const [buttonText, setButtonText] = useState('')
  const [visible, setVisible] = useState()
  const [phone, setPhone] = useState()
  
  useDidShow(async() => {
    const {data: good} = await getGood({ id: router.params.id })
    setDetails({
      ...good,
      goodDetails: good.goodDetails && good.goodDetails.split('<br>')
    })
    setButtonText(`${good.price}${config.unit}${good.withdraw > 0 ? `+${good.withdraw}兑换卡` : ''}`)
  })
  const conversion = async () => {
    if (!userInfo.phone && !phone) {
      return setVisible(true)
    }
    try {
      await trade({ redPacketId: details.id, type: details.type * 1 })
      Taro.showToast({
        title: '兑换成功',
      })
      
    } catch (e) {
      Taro.showToast({
        title: e.message,
        icon: 'none',
        duration: 3000,
      })
    }
  }
  const submit = async () => {
    if (!/^1[3456789]\d{9}$/.test(phone)) {
      return Taro.showToast({
        title: '手机号格式不正确',
        icon: 'none',
      })
      setPhone('')
    }
    await update({
      id: userInfo.id,
      phone,
    })
    setVisible(false)
    conversion()
  }
  return (
    <View className='container'>
      <View className='red-packet-container'>
        <View className='red-packet-image'>
          <Image src={details.image}
            mode='aspectFit'/>
          {
            (details.type === 3 || details.type === 4 || details.type === 6) &&
            <View className='float'>
              <View className='type'>现金红包</View>
              <View className='value'>{details.value}元</View>
            </View>
          }
          {
            (details.type === 5) &&
            <View className='float'>
              <View className='type'>话费充值</View>
              <View className='value'>{details.value}元</View>
            </View>
          }
        </View>
        <View className='red-packet-title'><Text>{details.title}</Text><Text>剩余{details.inventory}个</Text></View>
        <OpenData
          type='groupName'
          open-gid=''
        />
      </View>
      <View className='banner-ad'>
        <Ad
          unitId="adunit-6e83efa7722c7ed9"
          unit-id="adunit-6e83efa7722c7ed9"
          ad-intervals={60}></Ad>
      </View>
      <View className='good-detail'>
        <View className='header-line'>兑换详情</View>
        <View className='good-detail-info'>
          {details.goodDetails.map(item => 
            <View key={item}>{item}</View>)}
        </View>
      </View>
      <View className='red-packet-button'>
        {!userInfo.newuser && details.type * 1 === 3 && <Button className='disable-btn'>新用户才能兑换</Button>}
        {!(!userInfo.newuser && details.type * 1 === 3) && <Button onClick={() => conversion()}>{buttonText}</Button>}}
      </View>
      {visible && <View className='dialog'>
        <View className='content'>
          <View className='form'>
            <Input
              type='number'
              onInput={e => setPhone(e.detail.value)}
              placeholder='请输入需要充值的手机号码'
              maxLength={11}
            />
            <View
              className='btn'
              onClick={submit}>提交</View>
          </View>
          <View className='banner-ad'>
            <Ad
              unitId="adunit-effb4b2965cc8895"
              unit-id="adunit-effb4b2965cc8895"
              ad-intervals={60}></Ad>
          </View>
        </View>
      </View>
      }
    </View>
  )
}
RedPacket.options = {
  addGlobalClass: true
}
RedPacket.config = {
  navigationBarBackgroundColor: '#F3AD3D',
}
export default observer(RedPacket);