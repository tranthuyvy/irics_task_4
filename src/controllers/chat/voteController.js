import {
    createVote,
    findConversationById,
    findVoteByConversationId,
    findVoteById,
    findVoteByVoteOptionId,
    updateVoteById,
} from '~/models/chat';
import { updateConversationById } from '~/models/conversation.model';
import { findUserByID } from '~/models/user';
import generateService from '~/services/generateID';

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
                    // Tạo mảng options với mỗi option chứa id và giá trị
                    const optionsWithId = options.map((option, index) => ({
                        id: `${conversationId}_${index + 1}`,
                        value: option,
                        voters: [],
                    }));
                    const vote = {
                        conversationId,
                        isPinned,
                        question,
                        options: optionsWithId,
                        allowMultipleAnswers,
                        allowAddOption,
                        hideResultBeforeAnswers,
                        hideMemberAnswers,
                        allowChangeAnswers,
                        createdByUser: objCreatedbyUser,
                        isClosed: false,
                    };
                    await createVote(vote);
                    return res.status(200).json({ data: vote, message: 'create vote success' });
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
        const generateID = await generateService.generateID();
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
                
                // eslint-disable-next-line no-case-declarations
                const optionsWithId = await Promise.all(option.map(async (value, index) => ({
                    id: `${generateID}_${index}`,
                    value: value,
                    voters: [],
                })));
            
                // Cập nhật vote với các option mới có ID và giá trị
                await updateVoteById(voteId, { options: [...vote.options, ...optionsWithId] });
                //cập nhật vote
                // await updateVoteById(voteId, { options: [...vote.options, option] });

                // await updateVoteById(voteId, { options: vote.options.concat(option) });

                return res.status(200).json({ message: 'success' });

            default:
                return res.status(400).json({ message: 'Invalid type' });
        }
    } catch (error) {
        console.error(error);
    }
};

const getListVote = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { limit, offset, sort } = req.query;

        const conversation = await findConversationById(conversationId);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        let voteList = (await findVoteByConversationId(conversationId)) || [];

        // Sắp xếp nếu có tham số sort
        if (sort) {
            voteList = voteList.sort((a, b) => {
                if (sort === 'asc') {
                    return a.createdAt - b.createdAt;
                } else if (sort === 'desc') {
                    return b.createdAt - a.createdAt;
                }
                return 0;
            });
        }

        // Áp dụng limit và offset nếu có
        if (limit && offset) {
            voteList = voteList.slice(offset, offset + limit);
        } else if (limit) {
            voteList = voteList.slice(0, limit);
        }

        return res.status(200).json({ message: 'Get list vote success', data: voteList });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const answerVote = async (req, res) => {
    try {
        const { userId } = req.user;
        const { voteOptionId } = req.body;

        // Kiểm tra voteOptionId có tồn tại không
        if (!voteOptionId) {
            return res.status(400).json({ message: 'Vote option ID is required' });
        }

        // Lấy thông tin voteOptionId từ cơ sở dữ liệu
        const vote = await findVoteByVoteOptionId(voteOptionId);

        if (!vote) {
            return res.status(404).json({ message: 'Vote not found' });
        }

        // Kiểm tra xem người dùng đã tham gia bình chọn chưa
        const hasAnswered = vote.options.some(
            (option) => option.id === voteOptionId && option?.voters?.includes(userId),
        );

        if (hasAnswered) {
            return res.status(400).json({ message: 'You have already answered this vote' });
        }

        // Thêm userId vào danh sách người đã bình chọn cho option đó
        const updatedVote = {
            ...vote,
            options: vote.options.map((option) =>
                option.id === voteOptionId
                    ? {
                          ...option,
                          voters: [...option.voters, userId],
                      }
                    : option,
            ),
        };

        // Cập nhật thông tin vote vào cơ sở dữ liệu
        await updateVoteById(vote.id, updatedVote);

        return res.status(200).json({ message: 'Answer vote success' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export default { createNewVote, updateVote, getListVote, answerVote };

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
