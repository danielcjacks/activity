import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

import cors from 'cors'
import dotenv from 'dotenv'
import { login, signup, authorize_token } from './auth/auth_controllers'
import { add_query_ownership_clauses } from './query/query_ownership'
import { get_prisma_query } from './query/query_controller'
export const prisma = new PrismaClient()
import cron from 'node-cron'
import webpush from 'web-push'
import morgan from 'morgan'

export const start_server = () => {
  dotenv.config()

  webpush.setVapidDetails(
    'mailto:example@domain.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )

  cron.schedule('*/1 * * * *', async () => {
    const dotw = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ]
    const date = new Date()
    const hour = date.getUTCHours()
    const minute = date.getUTCMinutes()
    const day = dotw[date.getUTCDay() - 1]

    const wheres = { hour: hour, minute: minute, send_reminders: true }
    wheres[day] = true

    const res = await prisma.behaviour.findMany({
      where: wheres,
      include: { user: { include: { subscriptions: true } } },
    })

    const data = res.map((behaviour) => {
      return {
        subscriptions: behaviour.user.subscriptions.map((s) =>
          JSON.parse(s.subscription)
        ),
        name: behaviour.name,
        description: behaviour.description,
        hour: behaviour.hour,
        minute: behaviour.minute,
      }
    })

    data.forEach((behaviour) => {
      behaviour.subscriptions.forEach((s) => {
        try {
          webpush.sendNotification(
            s,
            `ACTIVITY Reminder to "${behaviour.name}"`
          )
        } catch (e) {
          console.log("Couldn't send push notification")
        }
      })
    })
  })

  // So we can use the prisma client in other files
  const app = express()

  const port = 5000

  app.use(express.json())
  app.use(cors())
  app.use(morgan('tiny'))

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

  app.post('/prisma/:table_name/:method', async (req, res) => {
    try {
      const prisma_query_methods = [
        'findUnique',
        'findFirst',
        'findMany',
        'count',
        'count',
        'aggregate',
        'groupBy',
      ]

      if (typeof req.body !== 'object' || Array.isArray(req.body)) {
        throw new Error('Body must be an object')
      }

      // let mapped_query
      // if (prisma_query_methods.includes(req.params.method)) {
      //   // @ts-ignore
      //   mapped_query = get_prisma_query(req.body, req.params.table_name, req.username)
      // }

      // @ts-ignore
      const result = await prisma[req.params.table_name][req.params.method](
        // mapped_query
        req.body
      )

      res.status(201).json(result)
    } catch (error) {
      res.status(400).json({
        error: {
          message: error.toString(),
        },
      })
    }
  })

  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}
