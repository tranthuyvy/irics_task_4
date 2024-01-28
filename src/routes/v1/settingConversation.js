import Setting from '../../controllers/chat/settingController'
import authenticateToken from '~/middlewares/authenticateToken'

export const RouterSettingConversation = (router) =>
    router
        .put('/conversations/setting/group/pin/:conversationId/:type', authenticateToken, Setting.PinNoteVoteMsg)
        .put('/conversations/setting/group/vote/:conversationId/:type', authenticateToken, Setting.AllowVote)