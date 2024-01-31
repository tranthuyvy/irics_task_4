import generateService from '../services/generateID';
import dataService from '../services/dataService';

export const CreateGroupChatModel = async (conversation) => {
    const data = dataService.readData();
    const GenerateIDconversation = generateService.generateID();
    const ConversationID = { id: await GenerateIDconversation, ...conversation };
    data.Conversation.push(ConversationID);
    dataService.writeData(data);
    return checkImportDataSuccess(GenerateIDconversation);
};

export const updateConversationById = async (conversationId, updatedConversation) => {
    const data = dataService.readData();
    // Tìm index của conversation trong mảng Conversation với id tương ứng
    const index = data.Conversation.findIndex((conversation) => conversation.id === conversationId);
    // Nếu không tìm thấy conversation, trả về lỗi 404
    if (index === -1) {
        throw new Error('Conversation not found');
    }
    data.Conversation[index] = { ...data.Conversation[index], ...updatedConversation };
    dataService.writeData(data);
};

// check success import data
const checkImportDataSuccess = (GenerateIDconversation) => {
    return dataService.findConversationByID(GenerateIDconversation);
};
