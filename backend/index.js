import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import { User } from './models/user.js';

const app = express();

// Middleware for parsing request body
app.use(express.json());

app.get('/',(request, response)=>{
    console.log(request)
    return response.status(234).send("Welcome")
});

app.post('/user', async (request, response) => {
    try {
      if (
        !request.body.name ||
        !request.body.email ||
        !request.body.password
      ) {
        return response.status(400).send({
          message: 'Send all required fields: title, author, publishYear',
        });
      }
      const newUser = {
        name: request.body.name,
        email: request.body.email,
        password: request.body.password,
        classes: request.body.classes ? request.body.classes: "",
      };
  
      const user = await User.create(newUser);
  
      return response.status(201).send(user);
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

  app.get('/user', async (request, response) => {
    try {
      const users = await User.find({});
  
      return response.status(200).json({
        count: users.length,
        data: users,
      });
    } catch (error) {
      console.log(error.message);
      response.status(500).send({ message: error.message });
    }
  });

  app.get('/user/:email', async (request, response) => {
    try {
      const { email } = request.params;
  
      // Use Mongoose to find a user by email
      const user = await User.findOne({ email });
  
      if (user) {
        return response.status(200).json(user);
      } else {
        return response.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.log(error.message);
      response.status(500).json({ message: 'Internal server error' });
    }
  });
  app.put('/user/:id', async (request, response) => {
    try {
      const { id } = request.params;
  
      // Check if at least one field is provided for the update
      if (Object.keys(request.body).length === 0) {
        return response.status(400).json({
          message: 'At least one field is required for the update',
        });
      }
  
      // Use Mongoose to update the user with array operations
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $addToSet: { classes: { $each: request.body.classes } } },
        { new: true }
      );
  
      if (!updatedUser) {
        return response.status(404).json({ message: 'User not found' });
      }
  
      return response.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      console.log(error.message);
      response.status(500).json({ message: 'Internal server error' });
    }
  });
  app.delete('/user/:id', async (request, response) => {
    try {
      const { id } = request.params;
  
      // Check if at least one field is provided for the update
      if (Object.keys(request.body).length === 0 || !request.body.classes || !Array.isArray(request.body.classes)) {
        return response.status(400).json({
          message: 'Invalid request body. Provide an array of classes to delete.',
        });
      }
  
      // Use Mongoose to update the user by pulling specified classes from the array
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $pull: { classes: { $in: request.body.classes } } },
        { new: true }
      );
  
      if (!updatedUser) {
        return response.status(404).json({ message: 'User not found' });
      }
  
      return response.status(200).json({ message: 'Classes deleted successfully', user: updatedUser });
    } catch (error) {
      console.log(error.message);
      response.status(500).json({ message: 'Internal server error' });
    }
  });
  

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