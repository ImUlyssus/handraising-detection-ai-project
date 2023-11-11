import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import { User } from './models/user.js';
import user from './routes/user.js';
import cors from 'cors';
const app = express();

// Middleware for parsing request body
app.use(express.json());
app.use(cors());
app.get('/',(request, response)=>{
    console.log(request)
    return response.status(234).send("Welcome")
});

app.use('/user', user)


mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });