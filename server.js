import express from 'express';
import { connect } from 'mongoose';
import usersRoute from './api/routes/users/routes.js'
import variationsRoute from './api/routes/variations/routes.js'
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import csurf from 'csurf';
import SensorSimulator from './api/services/variations/SensorSimulator.js';
import {saveAlert} from './api/services/variations/index.js';

(
  async () => 
    {
      // Define express
      const app = express();


      // Define csurf
      const csrfProtection = csurf({ cookie: true });

      // Middlewares
      app.use(express.json());
      app.use(cookieParser());
      app.use(csrfProtection);

      // Route to get csrf token for requests
      app.get('/csrf-token-random', csrfProtection, (req, res) => {
        res.json({ csrfToken: req.csrfToken() });
      });
      app.use((err, req, res, next) => {
        if (err.code === 'EBADCSRFTOKEN') {
          res.status(403).send('CSRF token is invalid');
        } else {
          next(err);
        }
      });
      // Welcome route
      app.get("/", (req, res) => {
        res.send({ message: "Welcome to monitoring web app" });
      });
      // Users routes
      app.use("/users", csrfProtection, usersRoute);

      // Variations routes
      app.use("/variations", csrfProtection, variationsRoute)


      // Initialize server
      const port = 3000;
      const server = app.listen(port, () => console.log(`listening on port ${port}`));

      const io = new Server(server);

      const sensorSimulator = new SensorSimulator();

      sensorSimulator.on('data', (data) => {
        console.log('Real time data:', data);
        io.emit('sensorData', data);
      });

      sensorSimulator.on('alert', (alert) => {
        console.log('Alerts:', alert);
        if (alert) {
          saveAlert(alert.type, alert.value);
        }
        io.emit('sensorAlert', alert);
      });

      io.on('connection', (socket) => {
        console.log('Connected');

        socket.on('disconnect', () => {
          console.log('Disconnected');
        });
      });

      sensorSimulator.start();

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