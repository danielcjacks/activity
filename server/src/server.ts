import express, { Request, Response } from 'express';

const app = express();

const port = 5000;

app.get('/health', (req, res) => {
  res.status(200).json();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
