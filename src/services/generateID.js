const generateID = () => {
  const characters = '0123456789abcdef'
  let id = ''
  for (let i = 0; i < 24; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return id
}
export default { generateID }