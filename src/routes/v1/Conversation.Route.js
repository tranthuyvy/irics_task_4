import CreateGroupChat from '~/controllers/DAK_API/GroupChatController'
export const RouterConversation = (router) =>
    router
        .get('/conversations/:id/', CreateGroupChat.CreateGroupChat)// create group chat router
        .post('/conversations', CreateGroupChat.CreateGroupChat)// create group chat router
        .patch('/conversations/:id', CreateGroupChat.UpdateNameGroupChat)// get group chat router