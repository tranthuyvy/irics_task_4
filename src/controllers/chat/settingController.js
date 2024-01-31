import dataService from '../../services/dataService'
import { StatusCodes } from 'http-status-codes'
import JWT from 'jsonwebtoken'

const PinNoteVoteMsg = (req, res) => {
  try {
    const { conversationId, type } = req.params

    const data = dataService.readData()
    const conversation = data.Conversation.find(conv => conv.id === conversationId)

    if (!conversation) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Conversation not found', success: false })
    }

    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]
    const decodedToken = JWT.verify(token, process.env.JWT_SECRET_KEY)
    const userId = decodedToken.userId

    const userInDirectUser = conversation.members.find(user => user.id === userId)
    const userOwned = conversation.createdBy

    if (userInDirectUser) {
      if (userInDirectUser.type !== 1 && userInDirectUser.type !== 2)
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Permission Denied', success: false })
    } else if (userId !== userOwned) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Permission Denied', success: false })
    }

    if (type === 'on') {
      updateSettingValue(conversation.conversationSetting, 3, true)
    } else if (type === 'off') {
      updateSettingValue(conversation.conversationSetting, 3, false)
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid type', success: false })
    }

    dataService.writeData(data)

    return res.status(StatusCodes.OK).json({ message: 'Success', success: true, conversation: conversation })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', success: false })
  }
}

const AllowVote = (req, res) => {
  try {
    const { conversationId, type } = req.params

    const data = dataService.readData()
    const conversation = data.Conversation.find(conv => conv.id === conversationId)

    if (!conversation) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Conversation not found', success: false })
    }

    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]
    const decodedToken = JWT.verify(token, process.env.JWT_SECRET_KEY)
    const userId = decodedToken.userId

    const userInDirectUser = conversation.members.find(user => user.id === userId)
    const userOwned = conversation.createdBy

    if (userInDirectUser) {
      if (userInDirectUser.type !== 1 && userInDirectUser.type !== 2)
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Permission Denied', success: false })
    } else if (userId !== userOwned) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Permission Denied', success: false })
    }

    if (type === 'on') {
      updateSettingValue(conversation.conversationSetting, 4, true)
    } else if (type === 'off') {
      updateSettingValue(conversation.conversationSetting, 4, false)
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid type', success: false })
    }

    dataService.writeData(data)

    return res.status(StatusCodes.OK).json({ message: 'Success', success: true, conversation: conversation })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', success: false })
  }
}

const AllowNote = (req, res) => {
  try {
    const { conversationId, type } = req.params

    const data = dataService.readData()
    const conversation = data.Conversation.find(conv => conv.id === conversationId)

    if (!conversation) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Conversation not found', success: false })
    }

    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]
    const decodedToken = JWT.verify(token, process.env.JWT_SECRET_KEY)
    const userId = decodedToken.userId

    const userInDirectUser = conversation.members.find(user => user.id === userId)
    const userOwned = conversation.createdBy

    if (userInDirectUser) {
      if (userInDirectUser.type !== 1 && userInDirectUser.type !== 2)
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Permission Denied', success: false })
    } else if (userId !== userOwned) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Permission Denied', success: false })
    }

    if (type === 'on') {
      updateSettingValue(conversation.conversationSetting, 5, true)
    } else if (type === 'off') {
      updateSettingValue(conversation.conversationSetting, 5, false)
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid type', success: false })
    }

    dataService.writeData(data)

    return res.status(StatusCodes.OK).json({ message: 'Success', success: true, conversation: conversation })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', success: false })
  }
}

const AllowSendMsg = (req, res) => {
  try {
    const { conversationId, type } = req.params

    const data = dataService.readData()
    const conversation = data.Conversation.find(conv => conv.id === conversationId)

    if (!conversation) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Conversation not found', success: false })
    }

    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]
    const decodedToken = JWT.verify(token, process.env.JWT_SECRET_KEY)
    const userId = decodedToken.userId

    const userInDirectUser = conversation.members.find(user => user.id === userId)
    const userOwned = conversation.createdBy

    if (userInDirectUser) {
      if (userInDirectUser.type !== 1 && userInDirectUser.type !== 2)
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Permission Denied', success: false })
    } else if (userId !== userOwned) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Permission Denied', success: false })
    }

    if (type === 'on') {
      updateSettingValue(conversation.conversationSetting, 6, true)
    } else if (type === 'off') {
      updateSettingValue(conversation.conversationSetting, 6, false)
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid type', success: false })
    }

    dataService.writeData(data)

    return res.status(StatusCodes.OK).json({ message: 'Success', success: true, conversation: conversation })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', success: false })
  }
}

const AllowReviewMember = (req, res) => {
  try {
    const { conversationId, type } = req.params

    const data = dataService.readData()
    const conversation = data.Conversation.find(conv => conv.id === conversationId)

    if (!conversation) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Conversation not found', success: false })
    }

    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]
    const decodedToken = JWT.verify(token, process.env.JWT_SECRET_KEY)
    const userId = decodedToken.userId

    const userInDirectUser = conversation.members.find(user => user.id === userId)
    const userOwned = conversation.createdBy

    if (userInDirectUser) {
      if (userInDirectUser.type !== 1 && userInDirectUser.type !== 2)
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Permission Denied', success: false })
    } else if (userId !== userOwned) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Permission Denied', success: false })
    }

    if (type === 'on') {
      updateSettingValue(conversation.conversationSetting, 7, true)
    } else if (type === 'off') {
      updateSettingValue(conversation.conversationSetting, 7, false)
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid type', success: false })
    }

    dataService.writeData(data)

    return res.status(StatusCodes.OK).json({ message: 'Success', success: true, conversation: conversation })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', success: false })
  }
}

const AllowJoinLinkInvite = (req, res) => {
  try {
    const { conversationId, type } = req.params

    const data = dataService.readData()

    const conversation = data.Conversation.find(conv => conv.id === conversationId)

    if (!conversation) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Conversation not found', success: false })
    }

    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]
    const decodedToken = JWT.verify(token, process.env.JWT_SECRET_KEY)
    const userId = decodedToken.userId

    const userInDirectUser = conversation.members.find(user => user.id === userId)

    const userOwned = conversation.createdBy

    if (userInDirectUser) {
      if (userInDirectUser.type !== 1 && userInDirectUser.type !== 2)
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Permission Denied', success: false })
    } else if (userId !== userOwned) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Permission Denied', success: false })
    }

    if (type === 'on') {
      updateSettingValue(conversation.conversationSetting, 9, true)
    } else if (type === 'off') {
      updateSettingValue(conversation.conversationSetting, 9, false)
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid type', success: false })
    }

    dataService.writeData(data)

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
    // eslint-disable-next-line no-console
    console.log('Invalid Type')
  }
}

export default { PinNoteVoteMsg, AllowVote, AllowNote, AllowSendMsg, AllowReviewMember, AllowJoinLinkInvite }