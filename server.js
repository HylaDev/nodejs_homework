import express from 'express';
import { connect } from 'mongoose';
import usersRoute from './api/routes/users/routes.js'
import variationsRoute from './api/routes/variations/routes.js'
import path from 'path';

(
  async () => 
    {
      // Define express
      const app = express();

      // Middlewares
      app.use(express.json());

      // Routes
      app.get("/", (req, res) => {
        res.send({ message: "Welcome to monitoring web app" });
      });
      app.use("/users", usersRoute);
      app.use("/variations", variationsRoute);
      app.get("/variation-monitoring", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "variations-monitoring.html"));
      });


      // Define the port
      const port = 3000;
      const server = app.listen(port, () => console.log(`listening on port ${port}`));

      //const io = socketIo(server);

      // connect to database
      connect("mongodb://localhost:27017/yelian")
        .then(() => {
          console.log("connected to mongodb");
        })
        .catch((error) => {
          console.log("error", error);
        });
    })
();