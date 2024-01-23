import crypto from 'crypto'

const generateKey = (password) => {
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem', cipher: 'aes-256-cbc', passphrase: hashedPassword }
  })

  return { publicKey, privateKey }
}

const encryptWithRSA = (publicKey, plaintext) => {
  const encryptedBuffer = crypto.publicEncrypt({
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
  }, Buffer.from(plaintext))
  return encryptedBuffer.toString('base64')
}

export { generateKey, encryptWithRSA }
