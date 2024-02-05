import { CreateGroupChatModel } from '~/models/conversation.model'
import { findUserByID } from '~/models/user'
import { v4 as uuidv4 } from 'uuid'
import { StatusCodes } from 'http-status-codes'
import { CheckSpecialInputCharacter } from '~/services/CheckData'
import dataService from '~/services/dataService'
import JWT from 'jsonwebtoken'
import { checkInputCreateGR, checkMembersFunc } from '~/validations/validationConversation'
// create conversation type = 2

const CreateGroupChat = async (req, res) => {
  const { type, name, memberIds } = req.body
  const check = await checkInputCreateGR(type, name, memberIds)
  if (check == true) {
    try {
      const tokenUser = req.headers.authorization
      const createdByUser = getIdUserOfToken(tokenUser).userId// get id user from token
      const typeConversation = type == 2 ? 'members' : 'directUser'// type of conversation
      const timeCreated = new Date().getTime()
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

      let objOwner = {
        type: 1,
        id: createUser.id,
        ownerAccepted: true,
        username: createUser.username,
        avatar: createUser.avatar,
        lastLogin: timeCreated,
      }

      //get information of userid
      const _users = memberIds.map((index) => getUser(index))
      const user = await Promise.all(_users)
      let userarr = []
      if (type == 2) {
        for (let i = 0; i < user.length; i++) {
          userarr.push({
            type: 3,
            id: user[i]?.id,
            ownerAccepted: true,
            username: user[i]?.username,
            avatar: user[i]?.avatar,
            lastLogin: timeCreated,
          })
        }
        userarr.push(objOwner)
      }
      else {
        
        for (let i = 0; i < user.length; i++) {
          userarr.push({
            type: 5,
            id: user[i]?.id,
            ownerAccepted: true,
            username: user[i]?.username,
            avatar: user[i]?.avatar,
            background_img: user[i]?.background_img,
            status: 0,
            isActiveMember: false,
            isBlockStranger: false,
            blockUserIds: [],
            lastLogin: timeCreated,
            createdAt: timeCreated,
            updatedAt: timeCreated
          })
        }
      }

      // craete inviteld 
      const inviteld = uuidv4().replace(/-/g, '')

      //create data to import database
      const conversation = {
        status: +type,
        avartar: 'https://test3.stechvn.org/api/image/2HD1c4cb1b8-9255-11ee-973a-0242c0a83003.Grey_and_Brown_Modern_Beauty_Salon_Banner_20231024_124517_0000.png',
        createdBy: createdByUser,
        name,
        lastMessageCreated: timeCreated,
        isDeleted: false,
        createdAt: timeCreated,
        updatedAt: timeCreated,
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
        inviteId: inviteld,//generated ID invited,
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
      // add data to database
      return res.status(200).json({ message: 'create group chat success', data: returnData })
    } catch (error) {
      return res.status(400).json({ message: 'failed', error: error })
    }
  }
  return res.status(500).json({ message: 'contains invalid characters' })
}

const UpdateNameGroupChat = async (req, res) => {
  try {
    const tokenUser = req.headers.authorization
    const idMember = getIdUserOfToken(tokenUser).userId

    const idConversation = req.params.id
    if (CheckSpecialInputCharacter(idConversation) == true) {
      return res.status(500).json({ message: 'contains invalid characters' })
    }
    const permission = await permissionMemberGroupChat(idMember, idConversation)

    if (permission !== undefined) {
      const NameGrchatUpdate = req.body.name
      await dataService.UpdateNameGroupChat(idConversation, NameGrchatUpdate)
    }
    return res.status(200).json({ message: 'update name succes' })
  } catch (error) {
    return res.status(400).json({ message: 'error' })
  }
}

const GetConversationBelongUser = async (req, res) => {
  try {
    const { offset, limit, search, status } = req.query

    if (CheckSpecialInputCharacter(search) == true) {
      return res.status(500).json({ message: 'contains invalid characters' })
    }
    if (+status != 1 && +status != 2) {
      return res.status(500).json({ message: 'erorr status' })
    }
    if (limit >= 20) {
      return res.status(500).json({ message: 'limit is not greater than 20' })
    }
    const tokenUser = req.headers.authorization
    const createdByUser = getIdUserOfToken(tokenUser).userId// get id user from token

    let result = await dataService.getConversationofUser(createdByUser, limit, search, status)

    return res.status(200).json({ message: 'update name succes', data: result })
  } catch (error) {
    return res.status(500).json({ message: error.message })

  }
}

const GetConversationDetail = async (req, res) => {
  const ConversationID = req.params.id
  if (CheckSpecialInputCharacter(ConversationID) == true) {
    return res.status(500).json({ message: 'contains invalid characters' })
  }
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
  if (await checkMembersFunc([memberID]) == false) {
    return res.status(500).json({ message: 'erorr userID' })
  }
  if (CheckSpecialInputCharacter(conversationId) == true) {
    return res.status(500).json({ message: 'contains invalid characters in conversation Id' })
  }
  let arrInfoMember = []

  // check Id
  let _checkId = await memberID.map(idMember => checkMember(idMember))

  // check exist member in conversation
  const dataConversation = await dataService.findConversationByID(conversationId)
  if (dataConversation== undefined){
    return res.status(500).json({ message: 'undefined conversation Id' })
  }
  let _checkExistMember = await memberID.map(idMember => dataConversation.members.find(value => value.id == idMember) ? true : false)

  // create information member
  for (let i = 0; i < _checkExistMember.length; i++) {
    if (_checkId[i] == true) {
      if (_checkExistMember[i] == true) { // check is already in conversation
        return res.status(200).json({ message: 'member already in conversation' })
      }
      await CrObjFunc(memberID, arrInfoMember)// update member to obj
      console.log(arrInfoMember[0])
      for (let index = 0; index < arrInfoMember.length; index++) {
        await dataService.UpdateMemberGroupChat(conversationId, arrInfoMember[index] )
      }
      return res.status(200).json({ message: 'add member to group succes' })
    }
    else {
      return res.status(404).json({ error: 'error member' })
    }
  }
}

const CrObjFunc = async (memberID, arrInfoMember) => {
  await Promise.all(memberID.map(async idMember => {
    let infoMember = await getUser(idMember)
    arrInfoMember.push({
      type: 4,
      id: idMember,
      ownerAccepted: true,
      username: infoMember.username,
      avatar: infoMember.avatar,
      lastLogin: infoMember?.lastLogin
    })
  }))
}

const JoinGroupByInviteld = async (req, res) => {
  try {
    const { inviteId } = req.params
    console.log(inviteId)
    const data = await dataService.readData()

    const dataConversation = await dataService.findConversationByInviteldId(inviteId)
    console.log(dataConversation)
    if (!dataConversation) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Invalid InviteId', success: false })
    }

    //{ type: 9, value: true }
    const allowJoin = dataConversation.conversationSetting.find(setting => setting.type === 9)

    if (!allowJoin.value) {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ message: 'Not Allowed', success: false })
    }

    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]
    const decodedToken = JWT.verify(token, process.env.JWT_SECRET_KEY)
    const userId = decodedToken.userId

    const userInProgram = data.users.find(user => user.id === userId)

    if (!userInProgram) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found', success: false })
    }

    const userInMember = dataConversation.members.find(user => user.id === userId)

    if (userInMember) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'User already exists in conversation', success: false })
    }

    dataConversation.members.push({
      type: 1,
      id: userId,
      ownerAccepted: true,
      username: userInProgram.username,
      avatar: userInProgram.avatar,
      lastLogin: userInProgram.lastLogin
    })

    await dataService.writeData(data)

    return res.status(StatusCodes.OK).json({ message: 'Success', success: true, conversation: dataConversation })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', success: false })
  }
}

const RemoveMemberToGroupChat = async (req, res) => {
  try {
    const conversationId = req.params.conversationId
    const memberID = req.body.ids
    if (CheckSpecialInputCharacter(conversationId) == true) {
      return res.status(500).json({ message: 'contains invalid characters in conversaiton ID' })
    }
    if (CheckSpecialInputCharacter(memberID) == true) {
      return res.status(500).json({ message: 'contains invalid characters in user ID' })
    }
    const tokenUser = req.headers.authorization
    const UserId = getIdUserOfToken(tokenUser).userId
    const checkMember = await dataService.findUserByID(memberID)
    if (checkMember == undefined) {
      return res.status(500).json({ message: 'invalid user' })
    }
    const _check = await PermissionDelMember(UserId, conversationId)
    if (_check == true) {
      await dataService.deleteMemberChat(memberID, conversationId)
      return res.status(200).json({ message: 'remove member succes' })
    }
    else
      return res.status(200).json({ message: 'no permission' })
  } catch (error) {
    return res.status(200).json({ message: error })
  }
}

// permission to delete member
const PermissionDelMember = async (idMember, idConversation) => {// check permissions of group chat
  const dataConversation = await dataService.findConversationByID(idConversation)

  const result = await dataConversation.members.find(value => value.id == idMember)// check conversation

  const checkPermission = result.type == 1 || result.type == 2 ? true : false// check type
  // const result = await dataConversation.member.find(value => value.type == 1 || value.type == 2 ? true : false)
  return checkPermission
}

// check member have exist
const checkMember = (memberID) => {
  return findUserByID(memberID) ? true : false
}

// delete DeleteConversation
const DeleteConversation = async (req, res) => {
  const idConversation = req.params.id

  if (CheckSpecialInputCharacter(idConversation) == true) {
    return res.status(500).json({ message: 'contains invalid characters in conversation' })
  }

  const tokenUser = req.headers.authorization

  const checkType = await dataService.findConversationByID(idConversation)
  if (checkType == undefined) {
    return res.status(500).json({ message: 'erorr Id conversation' })
  }
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
  const result = await dataConversation.members.find(value => value.id == createdByUser)// check conversation
  const checkPermission = result.type == 1 ? true : false
  return checkPermission
}

//hidden conversation
const HideConversation = async (req, res) => {
  const { conversationId, pin } = req.body
  if (CheckSpecialInputCharacter(conversationId) == true) {
    return res.status(500).json({ message: 'contains invalid characters in conversation' })
  }
  const tokenUser = req.headers.authorization
  const IdUser = getIdUserOfToken(tokenUser).userId
  const result = await dataService.addHideConversationfiled(conversationId, pin, IdUser)
  return res.status(200).json({ message: result.message })
}
//hide  conversation
const UnHideConversation = async (req, res) => {
  const { conversationId } = req.body
  if (CheckSpecialInputCharacter(conversationId) == true) {
    return res.status(500).json({ message: 'contains invalid characters in conversation' })
  }
  const tokenUser = req.headers.authorization
  const IdUser = getIdUserOfToken(tokenUser).userId
  const result = await dataService.UnHiddenConversation(conversationId, IdUser)
  return res.status(200).json({ message: result.message })
}

const PinConversation = async (req, res) => {
  const { action, conversationId } = req.params
  if (CheckSpecialInputCharacter(conversationId) == true) {
    return res.status(500).json({ message: 'contains invalid characters in conversation' })
  }
  if (action == 'pin') {
    const result = await dataService.PinConversationfunc(conversationId)
    return res.status(200).json({ message: result.message })
  }
  else return res.status(404).json({ error: 'error' })
}

const GrantMember = async (req, res) => {
  const { conversationId } = req.params
  const { userId, role } = req.body
  if (role !=1 && role !=2 && role !=3 ){
    return res.status(500).json({ message: 'invalid role' })
  }
  const tokenUser = req.headers.authorization
  const idOwnerCheck = getIdUserOfToken(tokenUser).userId
  if (CheckSpecialInputCharacter(conversationId) == true) {
    return res.status(500).json({ message: 'contains invalid characters in conversation' })
  }
  if (CheckSpecialInputCharacter(userId) == true) {
    return res.status(500).json({ message: 'contains invalid characters in user ID' })
  }
  const checkUser = dataService.findUserByID(userId)
  if (checkUser == undefined) {
    return res.status(500).json({ message: 'invalid user ID' })
  }
  // check type of user id in conversation
  const checkData = await dataService.checkTypeofUserConversation(conversationId, idOwnerCheck)// kiem tra user duoc phan quyen k 
  if (checkData == true) {
    const data = await dataService.checkUserInConversation(conversationId, userId)// kiem tra user co trong he thong khong
    if (data === true) {
      if (role == 1) {
        await dataService.UpdateRoleMember(conversationId, 2, idOwnerCheck)// phan quyen owner thanh admin 
        await dataService.UpdateRoleMember(conversationId, +role, userId)// phan quyen owner thanh admin 
        return res.status(200).json({ message: 'grant role success ' })
      }
      else {
        await dataService.UpdateRoleMember(conversationId, role, userId)
        return res.status(200).json({ message: 'grant role success' })
      }
    }
    return res.status(200).json({ message: 'user is not in the group' })
  }
  return res.status(200).json({ message: 'Authorless' })
}

const DisBandGroup = async (req, res) => {
  const { conversationId } = req.params
  if (CheckSpecialInputCharacter(conversationId) == true) {
    return res.status(500).json({ message: 'contains invalid characters in conversation' })
  }
  await dataService.disbandGroupfunc(conversationId)
}

const GetGroupByInviteld = async (req, res) => {
  const { inviteId } = req.params
  if (CheckSpecialInputCharacter(inviteId) == true) {
    return res.status(500).json({ message: 'contains invalid characters in inviteId' })
  }
  const checkInvited = dataService.findInvitedByID(inviteId)
  if (checkInvited == undefined){
    return res.status(500).json({ message: 'undefined  inviteId' })
  }
  const data = await dataService.getConversationByInviteld(inviteId)
  const obj = {
    avartar: data.avartar,
    name: data.name,
    reviewMember: true
  }
  return res.status(200).json({ message: 'success', data: obj })
}

const PreventJoin = async (req, res) => {
  const { conversationId } = req.params
  const { userId } = req.body
  if (CheckSpecialInputCharacter(conversationId) == true) {
    return res.status(500).json({ message: 'contains invalid characters in conversationId' })
  }
  if (CheckSpecialInputCharacter(userId) == true) {
    return res.status(500).json({ message: 'contains invalid characters in userId' })
  }
  const checkUser = await dataService.findUserByID(userId)
  if (checkUser==undefined){
    return res.status(500).json({ message: 'undefined userId' })
  }
  await dataService.PreventJoinMember(conversationId, userId)
  return res.status(200).json({ message: 'success' })
}

const UnPreventJoin = async (req, res) => {
  const { preventId } = req.body
  const { conversationId } = req.params
  if (CheckSpecialInputCharacter(preventId) == true) {
    return res.status(500).json({ message: 'contains invalid characters in conversationId' })
  }
  if (CheckSpecialInputCharacter(conversationId) == true) {
    return res.status(500).json({ message: 'contains invalid characters in conversationId' })
  }
  let checkConversation = await dataService.findConversationByID(conversationId)
  if (checkConversation == undefined){
    return res.status(500).json({ message: 'undefined conversationId' })
  }
  await dataService.UnPeventJoinMember(conversationId, preventId)
  return res.status(200).json({ message: 'success' })
}

const DecideConversations = async (req, res) => {
  const { conversationId, status } = req.params
  if (CheckSpecialInputCharacter(conversationId) == true) {
    return res.status(500).json({ message: 'contains invalid characters in conversationId' })
  }
  let checkConversation = await dataService.findConversationByID(conversationId)
  if (checkConversation == undefined){
    return res.status(500).json({ message: 'undefined conversationId' })
  }
  const tokenUser = req.headers.authorization
  const Iduser = getIdUserOfToken(tokenUser).userId
  const result = await dataService.decideConversationfunc(conversationId, Iduser)
  return res.status(200).json({ message: result.message })
}

const CreateIndivisualConversations = async (req, res) => {

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
    PinConversation,
    GrantMember,
    GetGroupByInviteld,
    JoinGroupByInviteld,
    PreventJoin,
    UnPreventJoin,
    DisBandGroup,
    DecideConversations,
    CreateIndivisualConversations
  }
