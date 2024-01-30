import express from 'express'
import { RouterConversation } from './Conversation.Route'
import { RouterChat } from './chat'
import { RouterSettingConversation } from './settingConversation'
import { RouterAuth } from './auth'
let router = express.Router()

const initAPIRoute = async (app) => {
    RouterConversation(router)
    RouterChat(router)
    RouterSettingConversation(router)
    RouterAuth('/api/auth', router)
    app.use('/', router)
}
export default initAPIRoute