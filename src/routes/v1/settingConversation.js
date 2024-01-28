import Setting from '../../controllers/chat/settingController'
import authenticateToken from '~/middlewares/authenticateToken'

export const RouterSettingConversation = (router) =>
    router
        .put('/conversations/setting/group/pin/:conversationId/:type', authenticateToken, Setting.PinNoteVoteMsg)
        .put('/conversations/setting/group/vote/:conversationId/:type', authenticateToken, Setting.AllowVote)
        .put('/conversations/setting/group/note/:conversationId/:type', authenticateToken, Setting.AllowNote)
        .put('/conversations/setting/group/send-msg/:conversationId/:type', authenticateToken, Setting.AllowSendMsg)
        .put('/conversations/setting/group/review-member/:conversationId/:type', authenticateToken, Setting.AllowReviewMember)
        .put('/conversations/setting/group/join-link-invite/:conversationId/:type', authenticateToken, Setting.AllowJoinLinkInvite)