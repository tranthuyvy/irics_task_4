import Setting from '../../controllers/chat/settingController'
import authenticateToken from '~/middlewares/authenticateToken'

export const RouterSettingConversation = (router) =>
    router
        .post('/conversations/setting/group/pin/:conversationId/:type', authenticateToken, Setting.PinNoteVoteMsg)