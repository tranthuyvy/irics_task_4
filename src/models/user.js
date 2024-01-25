import dataService from '../services/dataService'
import { v4 as uuidv4 } from 'uuid'

const addUser = (user) => {
  const data = dataService.readData()
  const userId = { id: uuidv4(), ...user }
  data.users.push(userId)
  dataService.writeData(data)
}

const findUserByUsernameOrEmail = (usernameoremail) => {
  const data = dataService.readData()
  return data.users.find(user => user.username === usernameoremail || user.email === usernameoremail)
}

export { addUser, findUserByUsernameOrEmail }
