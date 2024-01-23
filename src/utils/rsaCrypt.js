import crypto from 'crypto'

const generateKey = (password) => {
  try {
    const passphrase = crypto.createHash('sha256').update(password).digest('hex')

    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem', cipher: 'aes-256-cbc', passphrase }
    })

    return { publicKey, privateKey }
  } catch (error) {
    console.error('Error generating key:', error.message)
    throw error
  }
}

const encryptWithRSA = (publicKey, plaintext) => {
  try {
    const encryptedBuffer = crypto.publicEncrypt({
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    }, Buffer.from(plaintext))
    return encryptedBuffer.toString('base64')
  } catch (error) {
    console.error('Error encrypting with RSA:', error.message)
    throw error
  }
}

const decryptWithRSA = (privateKey, encryptedPassword) => {
  try {
    const decryptedBuffer = crypto.privateDecrypt({
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
    }, Buffer.from(encryptedPassword, 'base64'))
    return decryptedBuffer.toString('utf8')
  } catch (error) {
    console.error('Error decrypting with RSA:', error.message)
    throw error
  }
}

export { generateKey, encryptWithRSA, decryptWithRSA }
