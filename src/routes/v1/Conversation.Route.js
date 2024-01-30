import GroupChat from '~/controllers/DAK_API/GroupChatController'
export const RouterConversation = (router) =>
    router
        .get('/conversations', GroupChat.GetConversationBelongUser)
        .get('/conversations/:id', GroupChat.GetConversationDetail)
        .post('/conversations', GroupChat.CreateGroupChat)
        .post('/conversations/:conversationId/add', GroupChat.AddMemberToGroupChat)
        .post('/conversations/:conversationId/remove', GroupChat.RemoveMemberToGroupChat)
        .post('/conversations/hidden', GroupChat.HideConversation)
        .post('/conversations/unhidden', GroupChat.UnHideConversation)
        .post('/conversations/group/invite/:inviteId', GroupChat.JoinGroupByInviteId)
        .put('conversations/:action/:conversationId', GroupChat.PinConversation)
        .patch('/conversations/:id', GroupChat.UpdateNameGroupChat)
        .delete('/conversations/:id', GroupChat.DeleteConversation)