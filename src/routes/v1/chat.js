import Note from '~/controllers/chat/noteController'
import { verifyToken } from '~/middlewares/verifyToken'
export const RouterChat = (router) =>
    router
        .post('/conversations/note/:conversationId', verifyToken, Note.createNewNote)