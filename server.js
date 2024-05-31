import express from 'express';
import usersRoute from './api/routes/users/routes.js'
import variationsRoute from './api/routes/variations/routes.js'

const app = express();
app.use(express.json());
const port = 3000;
app.use("/users", usersRoute);
app.use("/variations", variationsRoute);

app.listen(port, () => console.log(`listening on port ${port}`));