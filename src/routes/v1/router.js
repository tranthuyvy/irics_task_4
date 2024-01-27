import express from 'express'
import { RouterConversation } from './Conversation.Route'
import { RouterChat }  from './chat'
let router = express.Router()

const initAPIRoute = async (app) => {
    RouterConversation(router)
    RouterChat(router)
    app.use('/', router)
}
export default initAPIRoute