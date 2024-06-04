import { connect } from "mongoose";

class Database {
  static connect() {
    const mongoUri = "mongodb://localhost:27017/yelian";

    return new Promise((resolve, reject) => {
      connect(mongoUri)
        .then(() => {
          console.log("MongoDB connected... ");
          resolve();
        })
        .catch((err) => {
          console.error("error connecting to MongoDB", err);
          reject(err);
        });
    });
  }
}
export default Database;