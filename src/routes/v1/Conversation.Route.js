import GroupChat from '~/controllers/DAK_API/GroupChatController'
export const RouterConversation = (router) =>
    router
        .get('/conversations', GroupChat.GetConversationBelongUser)// create group chat router
        .get('/conversations/:id', GroupChat.GetConversationDetail)// create group chat router
        .post('/conversations', GroupChat.CreateGroupChat)// create group chat router
        .patch('/conversations/:id', GroupChat.UpdateNameGroupChat)// get group chat router