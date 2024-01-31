import {
    findConversationById,
    createNote,
    updateNoteById,
    findNoteByConversationId,
    deleteNoteById,
} from '~/models/chat';
import { findUserByID } from '~/models/user';

const createNewNote = async (req, res) => {
    try {
        const { userId } = req.user;
        const { isPinned, content } = req.body;
        const { conversationId } = req.params;
        console.log(userId, isPinned, content, conversationId);
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
                const note = { conversationId, isPinned, content, createdByUser: objCreatedbyUser };
                await createNote(note);
                return res.status(200).json({ data: note, message: 'create note success' });
            }
        }
    } catch (error) {
        console.error(error);
    }
};

const updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        if (!noteId) {
            return res.status(400).json({ message: 'noteId is empty' });
        }
        if (!req.body) {
            return res.status(400).json({ message: 'body is empty' });
        }
        await updateNoteById(noteId, req.body);
        return res.status(200).json({ message: 'update note success' });
    } catch (error) {
        console.error(error);
        throw new Error('Error updating note');
    }
};

const getListNote = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { limit, offset, sort } = req.query;

        const conversation = await findConversationById(conversationId);

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        let notes = (await findNoteByConversationId(conversationId)) || [];

        // Sắp xếp nếu có tham số sort
        if (sort) {
            notes = notes.sort((a, b) => {
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
            notes = notes.slice(offset, offset + limit);
        } else if (limit) {
            notes = notes.slice(0, limit);
        }

        return res.status(200).json({ message: 'Get list note success', data: notes });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        await deleteNoteById(noteId);
        return res.status(200).json({ message: 'delete note success' });
    } catch (error) {
        console.error(error);
    }
};

export default { createNewNote, updateNote, getListNote, deleteNote };
