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
const UpdateNameGroupChat = (conversationID, TextUpdate) => {
  const data = readData()
  const index = findInexConversation(data, conversationID)
  data.Conversation[index].member.push(TextUpdate)
  writeData(data)
}

// update member in conversation
const UpdateMemberGroupChat = (conversationID, informationMember) => {
  try {

    const data = readData()
    const index = findInexConversation(data, conversationID)

    data.Conversation[index].member.push(informationMember)
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
    data.Conversation[index].member = data.Conversation[index].member.filter(item => item.id != MemberID)
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
        member: value.member.map(index => index.id == UserID ? true : false),
        id: value.id,
        type: value.satus
      }
    })

    datatest.map(value => {// check condition of query
      value.member.map(index => index == true && value.type == status ? arrConver.push(value.id) : 'none')
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
const findInexConversation = async (data, value) => {
  const index = data.Conversation.findIndex(item => item.id === value)
  return await index
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

export default
  {
    readData,
    writeData,
    UpdateNameGroupChat,
    findConversationByID,
    UpdateMemberGroupChat,
    deleteMemberChat,
    getConversationofUser
  }
