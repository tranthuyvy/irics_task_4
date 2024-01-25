import { generateID } from '~/services/generateID'
import dataService from '../services/dataService'

export const CreateGroupChatModel = async (conversation) => {
  const data = dataService.readData()
  const ConversationID = { id: await generateID, ...conversation }
  data.Conversation.push(ConversationID)
  dataService.writeData(data)
}
