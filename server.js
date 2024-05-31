import express from 'express';
import { connect } from "mongoose";
import usersRoute from './api/routes/users/routes.js'
import variationsRoute from './api/routes/variations/routes.js'

// Define express
const app = express();
 
// 
app.use(express.json());

// routes
app.use("/users", usersRoute);
app.use("/variations", variationsRoute);

// Connect to MongoDB
connect("mongodb://127.0.0.1:27017/yelianDB")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("error", error);
  });

// Define the port
const port = 3000;
app.listen(port, () => console.log(`listening on port ${port}`));