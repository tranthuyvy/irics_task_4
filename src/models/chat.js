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


export const createVote = async (vote) => {
    const data = dataService.readData()
    const generateVoteId = await generateService.generateID()

    const newVote = { id: generateVoteId, ...vote}
    data.votes.push(newVote)
    dataService.writeData(data)
}

export const findVoteById = async (voteId) => {
    const data = dataService.readData()
    return await data.votes.find(vote => vote.id === voteId)
}

export const updateVoteById = async (voteId, updatedVote) => {
    const data = dataService.readData()
    // Tìm index của vote trong mảng votes với id tương ứng
    const index = data.votes.findIndex(vote => vote.id === voteId)
    // Nếu không tìm thấy vote, trả về lỗi 404
    if (index === -1) {
        throw new Error('Vote not found');
    }
    data.votes[index] = { ...data.votes[index], ...updatedVote };
    dataService.writeData(data)
}
