import dataService from '../services/dataService'
import { v4 as uuidv4 } from 'uuid'

const addUser = (user) => {
  const data = dataService.readData()
  const userId = { id: uuidv4(), ...user }
  data.users.push(userId)
  dataService.writeData(data)
}

// const findUserByUsername = (username) => {
//   const data = dataService.readData()
//   return data.users.find(user => user.username === username)
// }

// const findUserByEmail = (email) => {
//   const data = dataService.readData()
//   return data.users.find(user => user.email === email)
// }

const findUserByUsernameOrEmail = (usernameoremail) => {
  const data = dataService.readData()
  return data.users.find(user => user.username === usernameoremail || user.email === usernameoremail)
}

const findUserByID = async (id) => {
  const data = await dataService.readData()
  return await data.users.find(user => user.id === id )
}

export { addUser, findUserByUsernameOrEmail, findUserByID }
