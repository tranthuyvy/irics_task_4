import Note from '~/controllers/chat/noteController'
import Vote from '~/controllers/chat/voteController'
import { verifyToken } from '~/middlewares/verifyToken'
export const RouterChat = (router) =>
    router
        .post('/conversations/note/:conversationId', verifyToken, Note.createNewNote)
        .post('/conversations/vote/:conversationId', verifyToken, Vote.createNewVote)