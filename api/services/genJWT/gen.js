import jwt from "jsonwebtoken";
import fs from "fs";

// Read the private key
const privateKey = fs.readFileSync("private.key");


function generateJwt(payload) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, privateKey, { algorithm: "RS256" }, (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      });
    });
  }

  export default generateJwt;