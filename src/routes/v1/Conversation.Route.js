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
        .put('/conversations/:action/:conversationId', GroupChat.PinConversation)
        .patch('/conversations/:id', GroupChat.UpdateNameGroupChat)
        .delete('/conversations/:id', GroupChat.DeleteConversation)
        .put('/conversations/group/grant/:conversationId', GroupChat.GrantMember)
        .put('/conversations/setting/group/prevent-join/:conversationId', GroupChat.PreventJoin)
        .put('/conversations/setting/group/unprevent-join/:conversationId', GroupChat.UnPreventJoin)
        .delete('/conversations/group/disband/:conversationId', GroupChat.DisBandGroup)
        .get('/conversations/group/invite/:inviteld', GroupChat.GetGroupByInviteld)
        .post('/conversations/group/invite/:inviteld', GroupChat.JoinGroupByInviteld)
