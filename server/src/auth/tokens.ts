const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const generate_token = (username: string) => {
  // Can add optional expiresIn argument if we want
  return jwt.sign({ username }, JWT_SECRET)
}

export { generate_token }
