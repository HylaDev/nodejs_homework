import express from "express";
import {addNewUser, getAllUsers} from "../../services/users/index.js";
import { hashPassword, generateJwt } from "../../services/hashPass/hash.js";
import isAuthenticated from "../../../middlewares/isAuthenticated/index.js";
import checkIsAdmin from "../../../middlewares/isAdmin/index.js";
import {body, validationResult} from 'express-validator';


const router = express.Router();
const validationRules = [
  body("email", "Email must be valid and not empty").notEmpty().isEmail(),
  body("isAdmin", "Must be boolean value and not empty").notEmpty().isBoolean(),
  body("password", "The minimum password length is 8 characters").isLength({min: 8})
];

router.get('/', isAuthenticated, checkIsAdmin, (req, res) => {
  getAllUsers()
  .then(users => res.status(200).json(users))
  .catch(err => res.status(500).json({ error: err }));
});

// Add new user
router.post("/add", validationRules, async (req, res) => {
  // Data validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
  }

   // Add new user
   const { email, isAdmin, password } = req.body;
   try {
     const hashedPassword = await hashPassword(password);
     const user = await addNewUser(email, isAdmin, hashedPassword);
 
     // Token generation and saved in cookie
     const payload = {
       _id: user._id,
       email: user.email,
       isAdmin: user.isAdmin,
     };
     const userToken = await generateJwt(payload);
     res.cookie("auth_token", userToken, { httpOnly: true});
     
     // Response after request successful
     return res.status(201).json({
       message: "User created",
       user: {
              _id: user._id,
              email: user.email,
              isAdmin: user.isAdmin
            },
     });
   } catch (error) {
     return res.status(500).json({ message: "An error occurred" });
   }
 }); 

 // Logout user

export default router;