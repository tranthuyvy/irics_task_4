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
    console.error({message:'failed to import data', error })
  }
}
// api update name gr chat
const UpdateNameGroupChat = async ( conversationID, TextUpdate ) => {
  const data = readData()
  const index = findInexConversation(data, conversationID)
  data.Conversation[index].name = TextUpdate
  writeData(data)
}

// find index conversation
const findInexConversation = (data, value) => {
  const index = data.Conversation.findIndex(item => item.id === value)
  return index
}

const findConversationByID = async (id) => {
  const data = await readData()
  return await data.Conversation.find(conversation => conversation.id === id )
}

export default { readData, writeData, UpdateNameGroupChat, findConversationByID }
