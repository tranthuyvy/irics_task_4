import fs from 'fs'
import path from 'path'

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
    const index = await findInexConversation(data, conversationID)
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
    const index = await findInexConversation(data, conversationID)

    await data.Conversation[index].member.push(informationMember)
    writeData(data)

    return { message: 'success' }
  } catch (error) {
    return { message: error }
  }
}

//delete member in conversation
const deleteMemberChat = (MemberID, conversationID) => {
  try {
    const data = readData()
    const index = findInexConversation(data, conversationID)
    data.Conversation[index].member = data.Conversation[index].members.filter(item => item.id != MemberID)
    // writeData(data)
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

    const datatest = data?.Conversation?.map(value => {// create array of conversation
      return {
        members: value?.members?.map(index => index.id == UserID ? true : false),
        id: value.id,
        type: value.status
      }
    })

    datatest.map(value => {// check condition of query
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
const findInexConversation = async (data, Idconversation) => {
  const index = await data.Conversation.findIndex(item => item.id === Idconversation)
  return index
}
//find conversation by invitedId
const findConversationByInvitedId = async (invitedId) => {
  const data = await readData()
  try {
    return await data.Conversation.find(conversation => conversation.inviteId === invitedId)
  } catch (error) {
    return { message: error.message }
  }
}

// find conversation by idconversation
const findConversationByID = async (id) => {
  const data = await readData()
  try {
    return await data.Conversation.find(conversation => conversation.id === id)
  } catch (error) {
    return { message: error.message }
  }
}

const deleteConversation = async (Idconversation) => {// update  field isdelete : true  
  try {
    const data = readData()
    const index = await findInexConversation(data, Idconversation)
    data.Conversation[index].isDeleted = true
    writeData(data)
  } catch (error) {
    console.log(error)
  }

}

const addHideConversationfiled = async (idConversation, pin) => {
  const data = readData()
  const index = await findInexConversation(data, idConversation)

  await data.Conversation[index].push(pin)
  writeData(data)
}

const addMemberToGroupChat = (conversation, newMember) => {
  const existingMemberIndex = conversation.member.findIndex(member => member.id === newMember.id)

  if (existingMemberIndex === -1) {

    conversation.member.push(newMember)
    return { success: true, message: 'added successfully' }
  } else {
    return { success: false, message: 'Member already exists in conversation' }
  }
}

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
    findConversationByInvitedId,
    addMemberToGroupChat
  }
