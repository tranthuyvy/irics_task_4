import { createVote, findConversationById, findVoteById, updateVoteById } from '~/models/chat';
import { updateConversationById } from '~/models/conversation.model';
import { findUserByID } from '~/models/user';

const createNewVote = async (req, res) => {
    try {
        const { userId } = req.user;
        const { conversationId } = req.params;
        const {
            isPinned = false,
            question,
            options,
            allowMultipleAnswers = true,
            allowAddOption = true,
            hideResultBeforeAnswers = true,
            hideMemberAnswers = false,
            allowChangeAnswers = true,
        } = req.body;
        //Kiểm tra options có phù hợp điều kiện không
        if (validateOptions(options) === false) {
            res.status(400).json({ error: 'Invalid options data' });
        } else {
            const conversation = await findConversationById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: 'conversation not found' });
            } else {
                const userNote = await findUserByID(userId);
                if (!userNote) {
                    return res.status(404).json({ message: 'user not found' });
                } else {
                    let objCreatedbyUser = {
                        type: 1,
                        id: userNote?.id,
                        ownerAccepted: true,
                        username: userNote?.username,
                        avatar: userNote?.avatar,
                        lastLogin: '2024-01 - 13T06: 34: 44.341Z',
                    };
                    const vote = {
                        conversationId,
                        isPinned,
                        question,
                        options,
                        allowMultipleAnswers,
                        allowAddOption,
                        hideResultBeforeAnswers,
                        hideMemberAnswers,
                        allowChangeAnswers,
                        createdByUser: objCreatedbyUser,
                        isClosed: false,
                    };
                    await createVote(vote);
                    return res.status(200).json({ message: 'create vote success' });
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const updateVote = async (req, res) => {
    try {
        const { userId } = req.user;
        const { voteId, action } = req.params;
        // Kiểm tra xem cuộc trò chuyện có đang mở bình chọn không

        const vote = await findVoteById(voteId);
        // kiểm tra vote có tồn tại không
        if (!vote) {
            return res.status(404).json({ message: 'vote not found' });
        }
        const conversation = await findConversationById(vote.conversationId);
        // Kiểm tra xem người dùng có phải là thành viên chính thức của cuộc trò chuyện không
        const isMember = conversation.members.find((member) => member.id === userId);
        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this conversation' });
        }
        const actionType = parseInt(action);
        switch (actionType) {
            case 1: //pin vote
                //kiểm tra xem người dùng có phải là admin hay owner của cuộc trò chuyện không
                if (isMember.type !== 1 && isMember.type !== 2) {
                    return res.status(403).json({ message: 'You are not a admin or owner of this conversation' });
                }
                await updateVoteById(voteId, { isPinned: true });
                await updateConversationById(vote.conversationId, { votePinned: [...conversation.votePinned, vote] });
                return res.status(200).json({ message: 'pin vote success' });
            case 2: //unpin vote
                //kiểm tra xem người dùng có phải là admin hay owner của cuộc trò chuyện không
                if (isMember.type !== 1 && isMember.type !== 2) {
                    return res.status(403).json({ message: 'You are not a admin or owner of this conversation' });
                }
                await updateVoteById(voteId, { isPinned: false });
                await updateConversationById(vote.conversationId, {
                    votePinned: conversation.votePinned.filter((item) => item.id !== voteId),
                });
                return res.status(200).json({ message: 'unpin vote success' });
            case 3: //close vote
                //kiểm tra xem người dùng có phải là người tạo vote của cuộc trò chuyện không
                if (vote.createdByUser.id !== userId) {
                    return res.status(403).json({ message: 'You are not a owner of this vote' });
                }
                await updateVoteById(voteId, { isClosed: true });
                await updateConversationById(vote.conversationId, {
                    votePinned: conversation.votePinned.filter((item) => item.id !== voteId),
                });
                return res.status(200).json({ message: 'close vote success' });
            case 4: // Thêm option
                // eslint-disable-next-line no-case-declarations
                const { option } = req.body;
                //Kiểm tra option có phù hợp điều kiện không
                if (validateOption(option) === false) {
                    return res.status(400).json({ error: 'Invalid option data' });
                }
                //cập nhật vote
                // await updateVoteById(voteId, { options: [...vote.options, option] });
                await updateVoteById(voteId, { options: vote.options.concat(option) });

                return res.status(200).json({ message: 'add new option success' });

            default:
                return res.status(400).json({ message: 'Invalid type' });
        }
    } catch (error) {
        console.error(error);
    }
};

export default { createNewVote, updateVote };

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

function validateOption(option) {
    // Kiểm tra xem số lượng option có nằm trong khoảng từ 1 đến 28 không
    if (option.length < 1 || option.length > 28) {
        return false;
    }
    // Kiểm tra từng option
    for (const option of option) {
        // Kiểm tra xem option có phải là chuỗi không
        if (typeof option !== 'string') {
            return false;
        }

        // Kiểm tra xem độ dài của option có nằm trong khoảng từ 1 đến 200 không
        if (option.length < 1 || option.length > 200) {
            return false;
        }
    }

    // Nếu qua tất cả các kiểm tra, options là hợp lệ
    return true;
}
