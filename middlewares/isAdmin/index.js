import User from '../../models/users/index.js';
import jwt from "jsonwebtoken";
import fs from "fs";


// Read the private key
const privateKey = fs.readFileSync("private.key");

function checkIsAdmin(req, res, next) {

    // Get the token from cookie
    const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized, token not found' });
    }

    try {
        // Verify the token and check if the user is an admin
        const decrypted = jwt.verify(token, privateKey);
        const userIsAdmin = decrypted.isAdmin; 

        if (userIsAdmin !== true) {
            return res.status(403).json({ 
                message: 'You are not admin, login as admin before get access to data' 
            });
        }

        next();
    } catch (err) {
        // Debug error
        //console.log(err);
        return res.status(403).json({
            message: "Token is not valid" 
        });
    }

  }

  export default checkIsAdmin;
  