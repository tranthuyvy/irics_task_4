import { CreateGroupChatModel } from '~/models/conversation.model'

// create conversation type = 2
export const CreateGroupChat = async (req, res) => {
  try {
    const { type, name, memberIds } = req.body
    const conversation = {
      satus: type,
      avartar: 'https://test3.stechvn.org/api/image/2HD1c4cb1b8-9255-11ee-973a-0242c0a83003.Grey_and_Brown_Modern_Beauty_Salon_Banner_20231024_124517_0000.png',
      createdBy: '',
      name,
      lastMessageCreated: '2024-01-20T07:39:49.440Z',
      isDeleted: false,
      createdAt: '2024-01-20T10:09:42.213Z',
      updatedAt: '2024-01-21T09:45:50.515Z',
      latestMessage: [],
      createdByUser: {},
      unSeenMessageTotal: 0,
      member: [{}],// get user from member ID
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
      userOffStatusMsg:[],
      inviteId: '',//generated ID invited,
      messagePinCount:0,
      isPinned : false , 
      notePinned :[],
      votePinned : []
    }
    CreateGroupChatModel(conversation)
    return res.status(200).json({ message: 'create group chat success' })
  } catch (error) {
    console.error(error)
  }
}
const getUser = () => {
  
}
