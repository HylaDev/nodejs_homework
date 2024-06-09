import Router from 'express';
import isAuthenticated from "../../../middlewares/isAuthenticated/index.js";
import checkIsAdmin from "../../../middlewares/isAdmin/index.js";
import {getAllAlerts} from '../../services/variations/index.js';

const router = Router();


router.get('/', isAuthenticated, checkIsAdmin, (req, res) => {
   getAllAlerts()
  .then(users => res.status(200).json(users))
  .catch(err => res.status(500).json({ error: err }));
});

export default router;