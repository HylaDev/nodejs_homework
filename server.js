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

      app.get('/csrf-token', csrfProtection, (req, res) => {
        res.json({ csrfToken: req.csrfToken() });
      });
      app.use((err, req, res, next) => {
        if (err.code === 'EBADCSRFTOKEN') {
          res.status(403).send('Formulaire non valide');
        } else {
          next(err);
        }
      });
      // Users routes
      app.get("/", (req, res) => {
        res.send({ message: "Welcome to monitoring web app" });
      });
      app.use("/users", csrfProtection, usersRoute);

      // Variations routes
      app.use("/variations", variationsRoute)
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      app.get("/variation-monitoring", (req, res) => {
        res.sendFile(path.join(__dirname, "public", "variations-monitoring.html"));
      });

      // Initialize server
      const port = 3000;
      const server = app.listen(port, () => console.log(`listening on port ${port}`));

      const io = new Server(server);
      
      io.on("connection", (sensorSimulator) => {
        console.log("Un utilisateur s'est connecté");
      
        sensorSimulator.on('data', (data) => {
          io.emit('data', data);
          
        })
      
        setInterval(() => {
          sensorSimulator.emit("message", "Message automatique");
        }, 5000);
      
        socket.on("disconnect", () => {
          console.log("Un utilisateur s'est déconnecté");
        });
      });

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