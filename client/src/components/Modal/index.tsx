import Taro, { useState } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtModal } from 'taro-ui'

interface Props {
 option: {
   showModal: boolean,
   text: string
 } 
}
function Index(props: Props) {
  console.log(11, props)

  const [showModal, setShowModal] = useState(false)
  // setShowModal(props.option.showModal)
  const [options, setOptions] = useState({
    text: ''
  })
  
  return (
      <AtModal
        isOpened={showModal}
        closeOnClickOverlay
      >
        {
          <View className='atmodal-content'>
            <View className='atmodal-content-label'>
              <View className='atmodal-content-label-text'>
                {options.text}
              </View>
            </View>
            <View
            onClick={() => setShowModal(false)}
              className='at-icon at-icon-close'/>
          </View>}
      </AtModal>
     )
}

export default Index