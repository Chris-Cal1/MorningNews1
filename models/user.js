const mongoose = require('mongoose');


// (2.2) création d'un fichier qui va contenir le schéma et le modèle de “users
//(4.5) Modification du schéma de user pour sauvegarder le futur token
var userSchema = mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    token: String,
    lang: String,
  
  });
  
var userModel = mongoose.model('users', userSchema);

module.exports = userModel