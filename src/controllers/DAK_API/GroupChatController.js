import { CreateGroupChatModel , UpdateNameGroupChatModel } from '~/models/conversation.model'
import { findUserByID } from '~/models/user'
import { v4 as uuidv4 } from 'uuid'
import JWT from 'jsonwebtoken'
// create conversation type = 2
const CreateGroupChat = async (req, res) => {
  try {
    const { type, name, memberIds } = req.body
    const token = req.rawHeaders[3]
    const tokenWithoutBearer = token.split('Bearer ')[1]
    const createdByUser = JWT.decode(tokenWithoutBearer) // get id user from token

    //get information of userid
    const _users = memberIds.map((index) => getUser(index))
    const user = await Promise.all(_users)
    let userarr = []
    //
    for (let i = 0; i < user.length; i++) {
      userarr.push({
        type: 1,
        id: user[i]?.id,
        ownerAccepted: true,
        username: user[i]?.username,
        avatar: user[i]?.avatar,
        lastLogin: '2024-01 - 13T06: 34: 44.341Z',
      })
    }
    //get information of Createduser
    const userinfo = createdByUser?.userId
    const createUser = await getUser(userinfo)
    let objCreatedbyUser = {
      id: createUser.id,
      username: createUser.username,
      email: createUser.email,
      background_img: createUser.background_img,
      avatar: createUser.avatar,
      status: 0,
      isActiveMember: false,
      isBlockStranger: false,
      blockUserIds: [],
      lastLogin: '2024-01 - 13T06: 34: 44.341Z',
      createdAt: '2024-01 - 13T06: 34: 44.343Z',
      updatedAt: '2024-01 - 13T06: 34: 44.343Z'
    }
    // craete inviteID 
    const inviteId = uuidv4().replace(/-/g, '')

    //create data to import database
    const conversation = {
      satus: type,
      avartar: 'https://test3.stechvn.org/api/image/2HD1c4cb1b8-9255-11ee-973a-0242c0a83003.Grey_and_Brown_Modern_Beauty_Salon_Banner_20231024_124517_0000.png',
      createdBy: createdByUser,
      name,
      lastMessageCreated: '2024-01-20T07:39:49.440Z',
      isDeleted: false,
      createdAt: '2024-01-20T10:09:42.213Z',
      updatedAt: '2024-01-21T09:45:50.515Z',
      latestMessage: [],
      createdByUser: objCreatedbyUser,
      unSeenMessageTotal: 0,
      member: userarr,// get user from member ID
      messagePin: [],
      conversationSetting: [
        {
          type: 3,
          value: true
        },
        {
          type: 4,
          value: true
        },
        {
          type: 7,
          value: true
        },
        {
          type: 6,
          value: true
        },
        {
          type: 5,
          value: true
        },
        {
          type: 9,
          value: true
        },
        {
          type: 1,
          value: 1700656327650
        },
        {
          type: 8,
          value: []
        }
      ],
      userOffStatusMsg: [],
      inviteId: inviteId,//generated ID invited,
      messagePinCount: 0,
      isPinned: false,
      notePinned: [],
      votePinned: []
    }
    //add data to database
    await CreateGroupChatModel(conversation)
    return res.status(200).json({ message: 'create group chat success' });
  } catch (error) {
    console.error(error);
  }
}
const UpdateNameGroupChat = async (req, res) => {
  console.log(req.params.id)
  console.log(req.body)
  
  return res.status(200).json({ message: 'update'})
}
const getUser = async (memberIds) => {
  return await findUserByID(memberIds);
};

export default { CreateGroupChat, UpdateNameGroupChat }
