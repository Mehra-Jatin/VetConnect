import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, VetConnect!');
}
);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
   connectDB();
}
);

export default app;