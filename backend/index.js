import express from 'express';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';


import PublicRoutes from './routes/PublicRoutes.js';
import AuthRoutes from './routes/AuthRoutes.js';
import DoctorRoutes from './routes/DoctorRoutes.js';
import UserRoutes from './routes/UserRoutes.js'

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json({limit:'10mb'}));
app.use(cookieParser());

app.use(cors(
   {
    origin: [process.env.CLIENT_URL], // Allow requests from these origins
    credentials: true,
   }
))


app.get('/', (req, res) => {
  res.send('Hello, VetConnect!');
}
);

app.use('/',PublicRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/doctor', DoctorRoutes);
app.use('/api/user', UserRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
   connectDB();
}
);

export default app;