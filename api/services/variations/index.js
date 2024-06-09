import variationModel from '../../../models/variations/index.js';


async function saveAlert(type, value) {
   return new Promise((resolve, reject) => {
     // instanciation du model 
     const newAlert = new variationModel({
       type,
       value,
     });

     // sauvegarder l'utilisateur dans la base de données
     newAlert
       .save()
       .then((alert) => {
         resolve(alert);
       })
       .catch((error) => {
         reject(error);
       });
   });
 }

 async function getAllAlerts() {
     return new Promise((resolve, reject) => {
       variationModel.find()
         .then(alerts => resolve(alerts))
         .catch(err => reject(err));
   });
 }
 
 export { saveAlert, getAllAlerts};