import GroupChat from '~/controllers/DAK_API/GroupChatController'
import authenticateToken from '~/middlewares/authenticateToken'

export const RouterConversation = (router) =>
    router
        .get('/conversations', authenticateToken, GroupChat.GetConversationBelongUser)
        .get('/conversations/:id', authenticateToken, GroupChat.GetConversationDetail)
        .post('/conversations', authenticateToken, GroupChat.CreateGroupChat)
        .post('/conversations/:conversationId/add', authenticateToken, GroupChat.AddMemberToGroupChat)
        .post('/conversations/:conversationId/remove', authenticateToken, GroupChat.RemoveMemberToGroupChat)
        .post('/conversations/hidden', authenticateToken, GroupChat.HideConversation)
        .post('/conversations/unhidden', authenticateToken, GroupChat.UnHideConversation)
        .put('/conversations/:action/:conversationId', authenticateToken, GroupChat.PinConversation)
        .patch('/conversations/:id/add', authenticateToken, GroupChat.UpdateNameGroupChat)
        .delete('/conversations/:id', authenticateToken, GroupChat.DeleteConversation)
        .put('/conversations/group/grant/:conversationId', authenticateToken, GroupChat.GrantMember)
        .put('/conversations/setting/group/prevent-join/:conversationId', authenticateToken, GroupChat.PreventJoin)
        .put('/conversations/setting/group/unprevent-join/:conversationId', authenticateToken, GroupChat.UnPreventJoin)
        .delete('/conversations/group/disband/:conversationId', authenticateToken, GroupChat.DisBandGroup)
        .get('/conversations/group/invite/:inviteId', authenticateToken, GroupChat.GetGroupByInviteld)
        .post('/conversations/group/invite/:inviteId', authenticateToken, GroupChat.JoinGroupByInviteld)
        .put('/conversations/:conversationId/decide/:status', authenticateToken, GroupChat.DecideConversations)
        // .post('/conversations/:action/:conversationId', authenticateToken, GroupChat.CreateIndivisualConversations)
