import generateService from '../services/generateID'
import dataService from '../services/dataService'

export const CreateGroupChatModel = async (conversation) => {
  const data = dataService.readData()
  const GenerateIDconversation = generateService.generateID()
  const ConversationID = { id: await GenerateIDconversation, ...conversation }
  data.Conversation.push(ConversationID)
  dataService.writeData(data)
}


