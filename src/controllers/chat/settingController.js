import dataService from '../../services/dataService'
import { StatusCodes } from 'http-status-codes'

const PinNoteVoteMsg = (req, res) => {
  try {
    const { conversationId, type } = req.params

    const data = dataService.readData()
    const conversation = data.Conversation.find(conv => conv.id === conversationId)

    if (!conversation) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Conversation not found', success: false })
    }

    if (type === 'on') {
      updateSettingValue(conversation.conversationSetting, 3, true)
    } else if (type === 'off') {
      updateSettingValue(conversation.conversationSetting, 3, false)
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid type', success: false })
    }

    return res.status(StatusCodes.OK).json({ message: 'Success', success: true, conversation: conversation })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', success: false })
  }
}

const updateSettingValue = (conversationSettings, targetType, newValue) => {
  const settingIndex = conversationSettings.findIndex(setting => setting.type === targetType)

  if (settingIndex !== -1) {
    conversationSettings[settingIndex].value = newValue
  } else {
    console.log('Invalid Type')
  }
}

export default { PinNoteVoteMsg }