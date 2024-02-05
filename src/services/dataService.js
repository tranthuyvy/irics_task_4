import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const filePath = path.join(__dirname, '../config/data.json')

const readData = () => {
  const rawData = fs.readFileSync(filePath)
  return JSON.parse(rawData)
}

const writeData = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error({ message: 'failed to import data', error })
  }
}

// api update name gr chat
const UpdateNameGroupChat = async (conversationID, TextUpdate) => {
  try {
    const data = readData()
    const index = await findIndexConversation(data, conversationID)
    data.Conversation[index].name = TextUpdate
    writeData(data)
  } catch (error) {
    return { message: error }
  }
}

// update member in conversation
const UpdateMemberGroupChat = async (conversationID, informationMember) => {
  try {
    const data = readData()
    const index = await findIndexConversation(data, conversationID)
    await data.Conversation[index].members.push(informationMember)
    writeData(data)
    return { message: 'success' }
  } catch (error) {
    return { message: error }
  }
}

//delete member in conversation
const deleteMemberChat = async (MemberID, conversationID) => {
  try {
    const data = readData()
    const index = await findIndexConversation(data, conversationID)
    data.Conversation[index].members = data.Conversation[index].members.filter(item => item.id != MemberID)
    writeData(data)
  } catch (error) {
    return { message: error }
  }
}

//get conversation belong to user
const getConversationofUser = async (UserID, limit, conversationID, status) => {
  if (conversationID) {
    return await findConversationByID(conversationID)
  }
  else {
    const data = readData()
    let arrConver = []
    let result = []
    
    const datatest = data.Conversation.map(value => {// create array of conversation
      return {
        members: value?.members?.map(index => index.id == UserID ? true : false) || value?.directUser?.map(index => index.id == UserID ? true : false),
        id: value.id,
        type: value.status
      }
    })

    await datatest.map(value => {// check condition of query
      value.members.map(index => index == true && value.type == status ? arrConver.push(value.id) : 'none')
    })

    for (let index = 0; index < limit - 1; index++) {
      if (arrConver[index] !== undefined) {
        let dataresult = await findConversationByID(arrConver[index])
        result.push(dataresult)
      }
    }

    return result
  }
}

// find index conversation
const findIndexConversation = async (data, Idconversation) => {
  const index = await data.Conversation.findIndex(item => item.id === Idconversation)
  return index
}
//find conversation by invitedId
const findConversationByInviteldId = async (invitedId) => {
  console.log(invitedId)
  const data = readData()
  try {
    const test = data.Conversation.find(conversation => conversation.inviteId == invitedId)
    return test
  } catch (error) {
    return { message: error.message }
  }
}

// find conversation by idconversation
const findConversationByID = async (id) => {
  const data = readData()
  try {
    return await data.Conversation.find(conversation => conversation.id === id)
  } catch (error) {
    return { message: error.message }
  }
}

//find user by ID 
const findUserByID = async (id) => {
  const data = await readData()
  try {
    return await data.users.find(user => user.id == id)
  } catch (error) {
    return { message: error.message }
  }
}
//find user by ID 
const findInvitedByID = async (id) => {
  const data = await readData()
  try {
    return await data.Conversation.find(Invited => Invited.inviteId == id)
  } catch (error) {
    return { message: error.message }
  }
}

const deleteConversation = async (Idconversation) => {// update  field isdelete : true
  try {
    const data = readData()
    const index = await findIndexConversation(data, Idconversation)
    data.Conversation[index].isDeleted = true
    writeData(data)
  } catch (error) {
    return { message: error.message }
  }
}

const addHideConversationfiled = async (idConversation, pin, IdUser) => {
  const data = readData()

  const checkExistIsHidden = await checkConversationIsHidden(IdUser, idConversation)
  if (checkExistIsHidden) {
    return { message: 'conversation alredy hidden' }
  }
  const index = await findIndexUser(data, IdUser)
  data.users[index].isConversationHidden.push({
    conversationId: idConversation,
    pin
  })
  writeData(data)
  return { message: 'conversation is Hidden' }
}

//find index of user in Users
const findIndexUser = async (data, IdUser) => {
  const index = await data.users.findIndex(item => item.id === IdUser)
  return index
}

const checkConversationIsHidden = async (IdUser, idConversation) => {
  const data = readData()
  const index = await findIndexUser(data, IdUser)
  const dataConversHidden = await data.users[index].isConversationHidden
  return await dataConversHidden.find(conversation => conversation.conversationId == idConversation)
}

const UnHiddenConversation = async (idConversation, IdUser) => {
  const data = readData()
  const index = await findIndexUser(data, IdUser)
  data.users[index].isConversationHidden = data.users[index].isConversationHidden.filter(item => item.conversationId !== idConversation)
  writeData(data)
  return { message: 'conversation is Unhidden' }
}

const PinConversationfunc = async (idConversation) => {
  const data = readData()
  const index = await findIndexConversation(data, idConversation)
  data.Conversation[index].isPinned = true
  writeData(data)
  return { message: 'conversation is pinned' }
}

const checkTypeofUserConversation = async (idConversation, userId) => {
  const dataType = await findConversationByID(idConversation)
  const check = await dataType.members.find(member => member.id == userId)
  return check ? true : false
}

const checkUserInConversation = async (idConversation, userId) => {
  const datacheck = await findConversationByID(idConversation)
  const result = await datacheck.members.find(member => member.id == userId)
  return result ? true : false
}

const UpdateRoleMember = async (idConversation, role, userId) => {
  console.log(idConversation, role, userId)
  const data = readData()
  const indexConversation = await findIndexConversation(data, idConversation)
  const indexUser = await findIndexUserInConversation(data, userId, indexConversation)
  data.Conversation[indexConversation].members[indexUser].type = role
  writeData(data)
}

const findIndexUserInConversation = async (data, userId, indexConversation) => {
  const index = await data.Conversation[indexConversation].members.findIndex(item => item.id == userId)
  return index
}

const PreventJoinMember = async (idConversation, UserID) => {
  const data = readData()
  const index = await findIndexConversation(data, idConversation)
  const idPrevent = uuidv4().replace(/-/g, '')

  if (!data.Conversation[index].IsPrevent) {
    data.Conversation[index].IsPrevent = []
  }
  data.Conversation[index].IsPrevent.push({
    preventId: idPrevent,
    idUser: UserID
  })
  writeData(data)
}

const UnPeventJoinMember = async (idConversation, IDprevent) => {
  const data = readData()
  const index = await findIndexConversation(data, idConversation)

  if (!data.Conversation[index].IsPrevent) {
    data.Conversation[index].IsPrevent = []
  }
  data.Conversation[index].IsPrevent = data.Conversation[index].IsPrevent.filter(item => item.preventId !== IDprevent)
  writeData(data)
}

const disbandGroupfunc = async (idConversation) => {
  const data = readData()
  data.Conversation = data.Conversation.filter(item => item.id != idConversation)
  writeData(data)
}


const getConversationByInviteld = async (invite) => {
  const data = readData()
  try {
    return await data.Conversation.find(conversation => conversation.inviteId === invite)
  } catch (error) {
    return { message: error.message }
  }
}

const getNotesByConversationId = (conversationId) => {
  const matchingNotes = []
  const data = readData()
  
  for (const note of data.notes) {
    if (note.conversationId === conversationId) {
      matchingNotes.push(note)
    }
  }

  return matchingNotes
}

const getVotesByConversationId = (conversationId) => {
  const matchingVotes = []
  const data = readData()
  
  for (const vote of data.votes) {
    if (vote.conversationId === conversationId) {
      matchingVotes.push(vote)
    }
  }

  return matchingVotes
}

const decideConversationfunc = async (conversationID, Iduser ) => {
  try {
    const data = readData()
    const permission = await PermissiontoDecideConvers(conversationID, Iduser)
    if (permission === true ){
      const index = await findIndexConversation(data, conversationID)
      console.log(index)
      data.Conversation[index].directUser[0].type = 3
      writeData(data)
      return { message: 'The decide was accepted' }
    }
    else return { message : 'permission is require' }
  } catch (error) {
    return { message: error }
  }
}

const PermissiontoDecideConvers = async (conversationID, Iduser) => {
  const data = await findConversationByID(conversationID)
  const permission = await data.directUser.find(member => member.id === Iduser) ? true : false
  return permission
}

const checkPermissionDel = async () => { }
const checkPreventJoinMember = async () => { }
const checkUnPreventJoinMember = async () => { }

export default
  {
    readData,
    writeData,
    UpdateNameGroupChat,
    findConversationByID,
    UpdateMemberGroupChat,
    deleteMemberChat,
    getConversationofUser,
    deleteConversation,
    addHideConversationfiled,
    UnHiddenConversation,
    PinConversationfunc,
    checkTypeofUserConversation,
    checkUserInConversation,
    UpdateRoleMember,
    PreventJoinMember,
    UnPeventJoinMember,
    disbandGroupfunc,
    getConversationByInviteld,
    findConversationByInviteldId,
    decideConversationfunc,
    getNotesByConversationId,
    getVotesByConversationId,
    findUserByID,
    findInvitedByID
  }
