import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import cors from 'cors'
import dotenv from 'dotenv'
import { login, signup, authorize_token } from './auth/auth_controllers'
import { add_query_ownership_clauses } from './query/query_ownership'
import { get_prisma_query } from './query/query_controller'

dotenv.config()

// So we can use the prisma client in other files
export const prisma = new PrismaClient()
const app = express()

const port = 5000

app.use(express.json())
app.use(cors())

app.get('/health', (req, res) => {
  res.status(200).json()
})

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.status(200).json(users)
})

app.post('/login', login)
app.post('/signup', signup)

app.use(authorize_token)

app.get('/login', (req, res) => {
  // @ts-ignore
  res.status(200).json()
})

const prisma_query_methods = ['findUnique', 'findFirst', 'findMany', 'count', 'count', 'aggregate', 'groupBy']

app.post('/prisma/:table_name/:method', async (req, res) => {
  try {
    if (typeof req.body !== 'object' || Array.isArray(req.body)) {
      throw new Error('Body must be an object')
    }

    let mapped_query
    if (prisma_query_methods.includes(req.params.method)) {
      // @ts-ignore
      mapped_query = get_prisma_query(req.body, req.params.table_name, req.username)
    }

    // @ts-ignore
    const result = await prisma[req.params.table_name][req.params.method](
      mapped_query
    )

    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.toString()
      }
    })
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})