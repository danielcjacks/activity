import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { signup } from './auth/auth_controllers'

dotenv.config()

// So we can use the prisma client in other files
export const prisma = new PrismaClient()
const app = express()

const port = 5000

app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json()
})

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.status(200).json(users)
})

app.post('/users', signup)

app.post('/prisma/:table_name/:method', async (req, res) => {
  try {
    if (typeof req.body !== 'object' || Array.isArray(req.body)) {
      throw new Error('Body must be an object')
    }

    // @ts-ignore
    const result = await prisma[req.params.table_name][req.params.method](
      req.body
    )

    res.status(201).json(result)
  } catch (error) {
    res.status(400).send(error.toString())
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
