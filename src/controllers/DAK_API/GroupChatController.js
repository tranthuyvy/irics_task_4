import { CreateGroupChatModel } from '~/models/conversation.model'
import dataService from '~/services/dataService'
import { findUserByID } from '~/models/user'
import { v4 as uuidv4 } from 'uuid'
import JWT from 'jsonwebtoken'
// create conversation type = 2
const CreateGroupChat = async (req, res) => {
  try {
    const { type, name, memberIds } = req.body
    const tokenUser = req.headers.authorization
    const createdByUser = getIdUserOfToken(tokenUser).userId// get id user from token
    const typeConversation = type == 2 ? 'member' : 'directUser'// type of conversation
    const timeCreated = new Date().getTime()

    //get information of userid
    const _users = memberIds.map((index) => getUser(index))
    const user = await Promise.all(_users)
    let userarr = []
    if (type == 2) {
      for (let i = 0; i < user.length; i++) {
        userarr.push({
          type: 1,
          id: user[i]?.id,
          ownerAccepted: true,
          username: user[i]?.username,
          avatar: user[i]?.avatar,
          lastLogin: '2024-01 - 13T06: 34: 44.341Z',
        })
      }
    }
    else {
      for (let i = 0; i < user.length; i++) {
        userarr.push({
          type: 1,
          id: user[i]?.id,
          ownerAccepted: true,
          username: user[i]?.username,
          avatar: user[i]?.avatar,
          background_img : user[i]?.background_img,
          status: 0,
          isActiveMember: false,
          isBlockStranger: false,
          blockUserIds: [],
          lastLogin: '2024-01-21T08:33:08.391Z',
          createdAt: '2024-01-21T08:33:08.394Z',
          updatedAt: '2024-01-21T08:33:08.394Z'
        })
      }
    }
    //
    //get information of Createduser
    const createUser = await getUser(createdByUser)

    let objCreatedbyUser = {
      id: createUser.id,
      username: createUser.username,
      email: createUser.email,
      background_img: createUser.background_img,
      avatar: createUser.avatar,
      status: 0,
      isActiveMember: false,
      isBlockStranger: false,
      blockUserIds: [],
      lastLogin: timeCreated,
      createdAt: timeCreated,
      updatedAt: timeCreated
    }

    // craete inviteID 
    const inviteId = uuidv4().replace(/-/g, '')

    //create data to import database
    const conversation = {
      status: +type,
      avartar: 'https://test3.stechvn.org/api/image/2HD1c4cb1b8-9255-11ee-973a-0242c0a83003.Grey_and_Brown_Modern_Beauty_Salon_Banner_20231024_124517_0000.png',
      createdBy: createdByUser,
      name,
      lastMessageCreated: '2024-01-20T07:39:49.440Z',
      isDeleted: false,
      createdAt: '2024-01-20T10:09:42.213Z',
      updatedAt: '2024-01-21T09:45:50.515Z',
      latestMessage: [],
      createdByUser: objCreatedbyUser,
      unSeenMessageTotal: 0,
      [typeConversation]: userarr,// get user from member ID
      messagePin: [],
      conversationSetting: [
        {
          type: 3,
          value: true
        },
        {
          type: 4,
          value: true
        },
        {
          type: 7,
          value: true
        },
        {
          type: 6,
          value: true
        },
        {
          type: 5,
          value: true
        },
        {
          type: 9,
          value: true
        },
        {
          type: 1,
          value: 1700656327650
        },
        {
          type: 8,
          value: []
        }
      ],
      userOffStatusMsg: [],
      inviteId: inviteId,//generated ID invited,
      messagePinCount: 0,
      isPinned: false,
      notePinned: [],
      votePinned: []
    }
    const result = await CreateGroupChatModel(conversation)

    const returnData = {
      type,
      avartar: 'https://test3.stechvn.org/api/image/2HD1c4cb1b8-9255-11ee-973a-0242c0a83003.Grey_and_Brown_Modern_Beauty_Salon_Banner_20231024_124517_0000.png',
      createdBy: createdByUser,
      name: name,
      lastMessageCreated: new Date().getTime(),
      isDeleted: false,
      _id: result.id,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    }
    //add data to database
    return res.status(200).json({ message: 'create group chat success', data: returnData })
  } catch (error) {
    return res.status(400).json({ message: 'failed', error: error })
  }
}

const UpdateNameGroupChat = async (req, res) => {
  const tokenUser = req.headers.authorization
  const idMember = getIdUserOfToken(tokenUser).userId
  const idConversation = req.params.id
  const permission = await permissionMemberGroupChat(idMember, idConversation)
  // console.log(permission)
  if (permission !== undefined) {
    const NameGrchatUpdate = req.body.name
    await dataService.UpdateNameGroupChat(idConversation, NameGrchatUpdate)
  }

  return res.status(200).json({ message: 'update name succes' })
}

const GetConversationBelongUser = async (req, res) => {
  const { offset, limit, search, status } = req.query
  const tokenUser = req.headers.authorization
  const createdByUser = getIdUserOfToken(tokenUser).userId// get id user from token
  let result = await dataService.getConversationofUser(createdByUser, limit, search, status)

  return res.status(200).json({ message: 'Success', data: result })
}

const GetConversationDetail = async (req, res) => {
  const ConversationID = req.params.id
  const data = await dataService.findConversationByID(ConversationID)
  if (data !== undefined) {
    return res.status(200).json({ message: 'succes', data })
  }
  else return res.status(404).json({ message: 'no conversation' })
}

const getUser = async (memberIds) => {
  return await findUserByID(memberIds)
}

const getIdUserOfToken = (token) => {// get id user of token
  const tokenWithoutBearer = token.split('Bearer ')[1]
  return JWT.decode(tokenWithoutBearer)
}

const permissionMemberGroupChat = async (idMember, idConversation) => {// check permissions of group chat
  const dataConversation = await dataService.findConversationByID(idConversation)
  const result = await dataConversation.members.find(value => value.id === idMember)
  return result
}

// add member to group chat
const AddMemberToGroupChat = async (req, res) => {
  const conversationId = req.params.conversationId
  const memberID = req.body.ids
  // check Id exist
  let arrInfoMember = []
  let _checkId = true
  let _checkExistMember = false
  await Promise.all(memberID.map(async (idMember) => {
    _checkId = await checkMember(idMember)
  }))

  // check exist member in conversation
  const dataConversation = await dataService.findConversationByID(conversationId)
  await Promise.all(memberID.map(async (idMember) => {
    _checkExistMember = await dataConversation.member.find(value => value.id === idMember) ? true : false
  })
  )

  // create information member
  if (_checkId == true && _checkExistMember == false) {
    await Promise.all(memberID.map(async idMember => {

      let infoMember = await getUser(idMember)

      arrInfoMember.push({
        type: 4,
        id: idMember,
        ownerAccepted: true,
        username: infoMember.username,
        avatar: infoMember.avatar,
        lastLogin: infoMember.lastLogin
      })

    }))

    // update member to data
    await Promise.all(arrInfoMember.map(async data =>
      await dataService.UpdateMemberGroupChat(conversationId, data)
    ))

    return res.status(200).json({ message: 'succes' })
  }
  else {
    if (_checkExistMember == true) return res.status(404).json({ error: 'member already in conversation' })
    return res.status(404).json({ error: 'error' })
  }
}

const RemoveMemberToGroupChat = async (req, res) => {
  const conversationId = req.params.conversationId
  const memberID = req.body.ids

  const UserId = getIdUserOfToken(req).userId

  const _check = await PermissionDelMember(UserId, conversationId)
  if (_check == true) {
    dataService.deleteMemberChat(memberID, conversationId)
    return res.status(200).json({ message: 'succes' })
  }
  else
    return res.status(200).json({ message: 'not have permission' })

}

// permission to delete member
const PermissionDelMember = async (idMember, idConversation) => {// check permissions of group chat
  const dataConversation = await dataService.findConversationByID(idConversation)

  const result = await dataConversation.member.find(value => value.id == idMember)// check conversation

  const checkPermission = result.type == 1 || result.type == 2 ? true : false// check type
  // const result = await dataConversation.member.find(value => value.type == 1 || value.type == 2 ? true : false)
  return checkPermission
}

// check member have exist
const checkMember = async (memberID) => {
  return await findUserByID(memberID) ? true : false
}

// delete DeleteConversation
const DeleteConversation = async (req, res) => {
  const idConversation = req.params.id
  const tokenUser = req.headers.authorization

  const checkType = await dataService.findConversationByID(idConversation)

  if (checkType.status == 1) {
    await dataService.deleteConversation(idConversation)
  }
  else {
    // check permissions member of gr chat
    const checkPermission = await PermissionDelConversation(tokenUser, idConversation)
    if (checkPermission == true) {
      await dataService.deleteConversation(idConversation)
    }
  }
  return res.status(200).json({ message: 'succes' })
}

//check permissions to delete conversation
const PermissionDelConversation = async (tokenUser, idConversation) => {
  const createdByUser = getIdUserOfToken(tokenUser).userId
  const dataConversation = await dataService.findConversationByID(idConversation)
  const result = await dataConversation.member.find(value => value.id == createdByUser)// check conversation
  const checkPermission = result.type == 1 ? true : false
  return checkPermission
}

//hide hide conversation 
const HideConversation = async (req, res) => {
  const { conversationId, pin } = req.body
  const ConversationHidden = { pin }
  dataService.hideConversation(conversationId, ConversationHidden)
  return res.status(200).json({ message: 'succes' })
}
//hide hide conversation 
const UnHideConversation = async (req, res) => {
  const {conversationId} = req.body
  return res.status(200).json({ message: 'succes' })
  
}

const PinConversation = async (req, res) => {

}

export default
  {
    CreateGroupChat,
    UpdateNameGroupChat,
    GetConversationBelongUser,
    GetConversationDetail,
    AddMemberToGroupChat,
    RemoveMemberToGroupChat,
    DeleteConversation,
    HideConversation,
    UnHideConversation,
    PinConversation
  }
