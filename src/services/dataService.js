import fs from 'fs'
import path from 'path'

const filePath = path.join(__dirname, '../config/data.json')

const readData = () => {
  const rawData = fs.readFileSync(filePath)
  return JSON.parse(rawData)
}

const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

export default { readData, writeData }
