import generateService from '../services/generateID';
import dataService from '../services/dataService';

export const createNote = async (note) => {
    const data = dataService.readData();
    const generateNoteId = await generateService.generateID();
    const newNote = { id: generateNoteId, ...note };
    data.notes.push(newNote);
    dataService.writeData(data);
};

export const updateNoteById = async (noteId, updatedNote) => {
    const data = dataService.readData();
    // Tìm index của note trong mảng notes với id tương ứng
    const index = data.notes.findIndex((note) => note.id === noteId);
    // Nếu không tìm thấy note, trả về lỗi 404
    if (index === -1) {
        throw new Error('Note not found');
    }
    data.notes[index] = { ...data.notes[index], ...updatedNote };
    dataService.writeData(data);
};

export const findNoteByConversationId = async (conversationId) => {
    const data = dataService.readData();
    return data.notes.filter((note) => note.conversationId === conversationId) || [];
};

export const findConversationById = async (conversationId) => {
    const data = dataService.readData();
    return await data.Conversation.find((conversation) => conversation.id === conversationId);
};

export const createVote = async (vote) => {
    const data = dataService.readData();
    const generateVoteId = await generateService.generateID();
    const newVote = { id: generateVoteId, ...vote };
    data.votes.push(newVote);
    dataService.writeData(data);
};

export const findVoteById = async (voteId) => {
    const data = dataService.readData();
    return await data.votes.find((vote) => vote.id === voteId);
};

export const findVoteByConversationId = async (conversationId) => {
    const data = dataService.readData();
    return data.votes.filter((vote) => vote.conversationId === conversationId) || [];
};

export const findVoteByVoteOptionId = async (voteOptionId) => {
    const data = dataService.readData();

    for (const vote of data.votes) {
        for (const option of vote.options) {
            if (option.id === voteOptionId) {
                return vote;
            }
        }
    }

    return null;
};

export const updateVoteById = async (voteId, updatedVote) => {
    const data = dataService.readData();
    // Tìm index của vote trong mảng votes với id tương ứng
    const index = data.votes.findIndex((vote) => vote.id === voteId);
    // Nếu không tìm thấy vote, trả về lỗi 404
    if (index === -1) {
        throw new Error('Vote not found');
    }
    data.votes[index] = { ...data.votes[index], ...updatedVote };
    dataService.writeData(data);
};

export const deleteNoteById = async (noteId) => {
    const data = dataService.readData();
    // Tìm index của note trong mảng notes với id tương ứng
    const index = data.notes.findIndex((note) => note.id === noteId);
    // Nếu không tìm thấy note, trả về lỗi 404
    if (index === -1) {
        throw new Error('Note not found');
    }
    data.notes.splice(index, 1);
    dataService.writeData(data);
};
