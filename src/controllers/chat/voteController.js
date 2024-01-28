import { createVote, findConversationById } from '~/models/chat'
import { findUserByID } from '~/models/user'


const createNewVote = async (req, res) => {
    try {
        const { userId } = req.user;
        const { conversationId } = req.params;
        const { isPinned = false, question, options, allowMultipleAnswers = true, allowAddOption = true, 
        hideResultBeforeAnswers = true, hideMemberAnswers = false, allowChangeAnswers = true } = req.body;
        if(validateOptions(options) === false) {
            res.status(400).json({ error: 'Invalid options data' });
        }
        else {
            const conversation = await findConversationById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: 'conversation not found' });
            }
            else {
                const userNote = await findUserByID(userId);
                if (!userNote) {
                    return res.status(404).json({ message: 'user not found' });
                }
                else {
                    let objCreatedbyUser = {
                        type: 1,
                        id: userNote?.id,
                        ownerAccepted: true,
                        username: userNote?.username,
                        avatar: userNote?.avatar,
                        lastLogin: '2024-01 - 13T06: 34: 44.341Z',
                    }
                    const vote = { conversationId, isPinned, question, options, allowMultipleAnswers, allowAddOption, hideResultBeforeAnswers, hideMemberAnswers, allowChangeAnswers, createdByUser: objCreatedbyUser };
                    console.log(vote);
                    await createVote(vote);
                    return res.status(200).json({ message: 'create vote success' });
                }
            }
        }
        
    } catch (error) {
        console.error(error);
    }
}

export default { createNewVote }

function validateOptions(options) {
    if (!Array.isArray(options)) {
        return false; // Phải là một mảng
    }

    if (options.length < 2 || options.length > 30) {
        return false; // Số lượng phương án từ 2 đến 30
    }

    for (const option of options) {
        if (typeof option !== 'string' || option.length > 200) {
            return false; // Mỗi phương án là chuỗi, không quá 200 ký tự
        }
    }

    return true; // Điều kiện đều thỏa mãn
}