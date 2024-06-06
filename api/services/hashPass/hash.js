import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";

// Read the private key
const privateKey = fs.readFileSync("private.key");

function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (error, salt) => {
      if (error) {
        reject(error);
      } else {
        bcrypt.hash(password, salt, (error, hash) => {
          if (error) {
            reject(error);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });
}

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

export { hashPassword, generateJwt };
