import express from 'express'
import { RouterConversation } from './Conversation.Route'
let router = express.Router()

const initAPIRoute = async (app) => {
  RouterConversation(router)
  return app.use('/', router)
}
export default initAPIRoute