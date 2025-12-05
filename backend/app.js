import cors from 'cors'
import dotenv from 'dotenv';
import morgan from 'morgan';
import express from 'express';
import connectDB from './src/config/db.js';
// import Route from './src/routes/index.js';

dotenv.config();

const app = express();
const Name = 'RFP-AI-managing'

const PORT = process.env.PORT || 3003


app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(cors())



connectDB()
console.log("hlo")

app.listen(PORT, () => {
  console.log(`Server started successfully at http://localhost:${PORT} - ${Name} backend service!`); 
});
