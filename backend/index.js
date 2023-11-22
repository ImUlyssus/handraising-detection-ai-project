import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import axios from "axios";
import mongoose from 'mongoose';
import { User } from './models/user.js';
import user from './routes/user.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Middleware for parsing request body
app.use(express.json());
app.use(cors());
app.get('/',(request, response)=>{
    console.log(request)
    return response.status(234).send("Welcome")
});

// app.use('/images', express.static(path.join(__dirname, '../History')));

app.use('/user', user)
app.use('/saveAndClear', user)
app.use('/getImages', user)
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