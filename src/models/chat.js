import generateService from '../services/generateID'
import dataService from '../services/dataService'

export const createNote = async (note) => {
    const data = dataService.readData()
    const generateNoteId = await generateService.generateID()

    const newNote = { id: generateNoteId, ...note}
    data.notes.push(newNote)
    dataService.writeData(data)
}

export const findConversationById = async (conversationId) => {
    const data = dataService.readData()
    return await data.Conversation.find(conversation => conversation.id === conversationId)

}
