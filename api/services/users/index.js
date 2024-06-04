 import userModel from '../../../models/users/index.js';


 function addNewUser(email, isAdmin, password) {
    return new Promise((resolve, reject) => {
      // instancier mon model utilisateur
      const newUser = new userModel({
        email,
        isAdmin,
        password,
      });

      // sauvegarder l'utilisateur dans la base de données
      newUser
        .save()
        .then((user) => {
          resolve(user);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function getAllUsers() {
      return new Promise((resolve, reject) => {
        userModel.find()
          .then(users => resolve(users))
          .catch(err => reject(err));
    });
  }
  export { addNewUser, getAllUsers};