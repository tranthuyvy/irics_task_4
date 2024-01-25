import { CreateGroupChat } from '~/controllers/DAK_API/GroupChatController'
export const RouterConversation = (router) =>
    router
        .post('/conversations', CreateGroupChat)// create group chat router
        .get('/conversations', CreateGroupChat)// create group chat router