import Taro from '@tarojs/taro'
import { View, OpenData, Button, Textarea, Form } from '@tarojs/components'
import { suggest } from '@/service/cloud'
import './index.scss'

function Index() {
  const formSubmit = async(e) => {
    const { value } = e.detail.value
    if (String(value).length < 5) {
      Taro.showToast({
        title: '要详细点哦~',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    const { status } = await suggest({ data: value })
    if (status === 0) {
      await Taro.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000,
      })
      Taro.redirectTo({
        url: '/pages/index/index'
      })
    }
  }
  return (
    <View className='container'>
      <View className='header'>
        <View className='user-avatar'>
          <OpenData type='userAvatarUrl' />
        </View>
      </View>
      <Form onSubmit={formSubmit} >
        <View className='body'>
          <Textarea
            value=""
            className='textarea'
            name='value'
            autoHeight
            showConfirmBar
            onConfirm={formSubmit}
            placeholder='感谢您的反馈和建议。。。'
          />
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
  navigationBarTitleText: '意见反馈',
  navigationBarBackgroundColor: '#feab01'
}

export default Index