import { findConversationById, createNote } from '~/models/chat'
import { findUserByID } from '~/models/user';


const createNewNote = async (req, res) => {
  try {
    const {userId} = req.user;
    const { isPinned, content } = req.body;
    const { conversationId } = req.params;
    console.log(userId, isPinned, content, conversationId);
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
            const note = { conversationId, isPinned, content, createdByUser: objCreatedbyUser };
            await createNote(note);
            return res.status(200).json({ message: 'create note success' });
        }
    }
  } catch (error) {
    console.error(error);
  }
}

export default { createNewNote }