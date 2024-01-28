import Setting from '../../controllers/chat/settingController'

import { verifyToken } from '~/middlewares/verifyToken'

export const RouterSettingConversation = (router) =>
    router
        .post('/conversations/setting/group/pin/:conversationId/:type', Setting.PinNoteVoteMsg)