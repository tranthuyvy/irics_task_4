import GroupChat from '~/controllers/DAK_API/GroupChatController'
export const RouterConversation = (router) =>
    router
        .get('/conversations', GroupChat.GetConversationBelongUser)
        .get('/conversations/:id', GroupChat.GetConversationDetail)
        .post('/conversations', GroupChat.CreateGroupChat)
        .post('/conversations/:conversationId/add', GroupChat.AddMemberToGroupChat)
        .post('/conversations/:conversationId/remove', GroupChat.RemoveMemberToGroupChat)
        .patch('/conversations/:id', GroupChat.UpdateNameGroupChat)