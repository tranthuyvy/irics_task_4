import Note from '~/controllers/chat/noteController';
import Vote from '~/controllers/chat/voteController';
import { verifyToken } from '~/middlewares/verifyToken';
export const RouterChat = (router) =>
    router
        .post('/conversations/note/:conversationId', verifyToken, Note.createNewNote)
        .put('/conversations/note/update/:noteId', verifyToken, Note.updateNote)
        .get('/conversations/note/:conversationId', verifyToken, Note.getListNote)
        .delete('/conversations/note/:noteId', verifyToken, Note.deleteNote)
        .post('/conversations/vote/:conversationId', verifyToken, Vote.createNewVote)
        .put('/conversations/vote/:voteId/:action', verifyToken, Vote.updateVote)
        .get('/conversations/vote/:conversationId', verifyToken, Vote.getListVote)
        .post('/conversations/answers-vote', verifyToken, Vote.answerVote);
