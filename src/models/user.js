import dataService from '../services/dataService'
import { v4 as uuidv4 } from 'uuid'

const addUser = (user) => {
  const data = dataService.readData()
  const userId = { id: uuidv4(), ...user }
  data.users.push(userId)
  dataService.writeData(data)
}

const findUserByUsername = (username) => {
  const data = dataService.readData()
  return data.users.find(user => user.username === username)
}

const findUserByEmail = (email) => {
  const data = dataService.readData()
  return data.users.find(user => user.email === email)
}

export { addUser, findUserByUsername, findUserByEmail }
