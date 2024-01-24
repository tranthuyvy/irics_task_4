import crypto from 'crypto'

const generateKeyPair = (username) => {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
    }, (err, publicKey, privateKey) => {
      if (err) {
        console.error('Error generating key pair:', err)
        return reject(err)
      }

      const keyPair = { publicKey, privateKey, username }
      return resolve(keyPair)
    })
  })
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

export { generateKeyPair, encryptWithRSA, decryptWithRSA }
