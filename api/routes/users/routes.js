import express from "express";
import {addNewUser, getAllUsers} from "../../services/users/index.js";
import { hashPassword, generateJwt } from "../../services/hashPass/hash.js";
import isAuthenticated from "../../../middlewares/isAuthenticated/index.js";
import checkIsAdmin from "../../../middlewares/isAdmin/index.js";
import {body, validationResult} from 'express-validator';
import userModel from "../../../models/users/index.js";
import bcrypt  from 'bcrypt';


const router = express.Router();

// Data validations rules
const validationRules = [
  body("email", "Email must be valid and not empty").notEmpty().isEmail(),
  body("isAdmin", "Must be boolean value and not empty").notEmpty().isBoolean(),
  body("password", "The minimum password length is 8 characters").isLength({min: 8})
];

// Get all users
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
    
    // Get user informations from body of request
    const { email, isAdmin, password } = req.body;

    try {
      // Check if user already exists
      const userEmail = await userModel.findOne({ email });
      const hashedPassword = await hashPassword(password);
      if (userEmail) {
        return res.status(400).json({message: 'This user alredy exists'});
      } 
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
      console.log(error)
      return res.status(500).json({ message: "An error occurred" });
    }
 }); 

 // Login user
 router.post("/login", async(req, res) => {
    const {email, password} = req.body;

    try { 
      // Check if user provide the right credentials
      const user = await userModel.findOne({email});
      if (!user) {
        return res.status(400).json({ message: "User email not found" });
      }
      
      const userPassWord = await bcrypt.compare(password, user.password);
      if (!userPassWord) {
        return res.status(400).json({ message: "Invalid password" });
      }
      // Token generation and saved in cookie
      const payload = {
        _id: user._id,
        isAdmin: user.isAdmin
      };
      const userToken = await generateJwt(payload);
      res.cookie("auth_token", userToken, { httpOnly: true});
      res.status(200).json({ message: "Login successful"})

    }catch (error) {
      console.log(error);
      return res.status(500).json({ message: "An error occurred" });
    }
 });

 // Logout user
 router.get('/logout', async(req, res) => {

  // Get token from cookie
    const userSession = req.headers.cookie;
    if (!userSession) {
      return res.status(404).json({message: "Token not found"});
    }
    res.clearCookie(userSession);
    res.status(200).json({message:  "User logout successfully"});
    
 });

export default router;