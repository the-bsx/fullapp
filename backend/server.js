import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import cors from 'cors'; // Import cors

dotenv.config();



const app =express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);


app.get('/',(req, res) => {
    res.send('server ready')
})

app.listen(port, () => {
    console.log(`server listening in port ${port}`);
})

