import { generateID } from '~/services/generateID'
import dataService from '../services/dataService'

export const CreateGroupChatModel = (conversation) => {
  const data = dataService.readData()
  const ConversationID = { id: generateID, ...conversation }
  data.Conversation.push(ConversationID)
  dataService.writeData(data)
}
