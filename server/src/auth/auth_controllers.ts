import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../server'
import { generate_token } from './tokens'

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) return res.status(400).json()
  // Shouldn't compare manually because it is vulnerable to timing attacks
  const password_correct = await bcrypt.compare(password, user.password)
  if (!password_correct) return res.status(400).json()
  const token = generate_token(username)
  res.status(200).json(token)
}

const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body
  const user = await prisma.user.findUnique({ where: { username } })

  // If username already exists, send bad response
  if (user) return res.status(400).json()

  // Hash password, with salt, over ten rounds
  const hashed_password = await bcrypt.hash(password, 10)

  const new_user = await prisma.user.create({
    data: { username, password: hashed_password },
  })

  const token = generate_token(new_user.username)

  res.status(201).json(token)
}

export { login, signup }
