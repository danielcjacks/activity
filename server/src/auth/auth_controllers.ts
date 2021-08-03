import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../server'
import { generate_token, extract_token } from './tokens'

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user)
    return res.status(400).json({
      error: { message: 'Username does not exist', error_path: ['username'] },
    })
  // Shouldn't compare manually because it is vulnerable to timing attacks
  const password_correct = await bcrypt.compare(password, user.password)
  if (!password_correct) {
    return res.status(400).json({
      error: { message: 'Incorrect password', error_path: ['password'] },
    })
  }
  const token = generate_token(username)
  setTimeout(() => {
    res.status(200).json({ token, userId: user.id })
  }, 2000)
}

const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body
  const user = await prisma.user.findUnique({ where: { username } })

  // If username already exists, send bad response
  if (user)
    return res.status(400).json({
      error: { message: 'Username already exists', error_path: ['username'] },
    })

  // Hash password, with salt, over ten rounds
  const hashed_password = await bcrypt.hash(password, 10)

  const new_user = await prisma.user.create({
    data: { username, password: hashed_password },
  })

  const token = generate_token(new_user.username)

  res.status(200).json({ token, userId: new_user.id })
}

const authorize_token = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth_header = req.headers['authorization']
  const token = auth_header && auth_header.split(' ')[1]
  // Unauthorized response
  if (!token)
    return res.status(401).json({ error: { message: 'Invalid token' } })
  try {
    const { username } = await extract_token(token)
    // Save username to request,
    // so we can access in other routes
    // @ts-ignore
    req.username = username
    next()
  } catch (e) {
    // If invalid token
    res.status(401).json({ error: { message: 'Invalid token' } })
  }
}

export { login, signup, authorize_token }
