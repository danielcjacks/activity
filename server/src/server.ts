import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

const port = 5000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json();
});

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
});

app.post('/users', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await prisma.user.create({ data: { username, password } });
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json();
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
