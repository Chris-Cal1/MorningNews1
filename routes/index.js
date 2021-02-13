var express = require('express');
var router = express.Router();

// (4.1) importation des deux modules nécessaires au chiffrement
var uid2 = require('uid2');
var bcrypt = require('bcrypt');

var userModel = require('../models/user')
var articleModel = require('../models/article')



//(2.1) création d'une nouvelle route nommée /sign-up qui se chargera d’ajouter un nouvel utilisateur
//(2.3) requête permettant de créer un utilisateur en base de données
router.post('/sign-up', async function(req, res, next){
 
  //(4.2) générez le hash via bcrypt.
  const hash = bcrypt.hashSync(req.body.password, 10);

  var error = []
  var result = false
  var userSave = null
  var token = null

  const data = await userModel.findOne({
    email: req.body.email,
  })

 if(data != null){
   error.push('Utilisateur déjà présent')
 }

 if(req.body.username == ''
 || req.body.email == ''
 || req.body.password == ''
 ){
   error.push('champs vides')
 }

 //(4.3) Modification de la requête pour prendre en compte l’enregistrement du mot de passe désormais chiffré.
 //(4.6) modification de la requête pour ajouter la nouvelle propriété qui sera initialisée avec un id généré grâce au module uid2.
 if(error.length == 0) {
    var newUser = new userModel({
    userName: req.body.username,
    email: req.body.email,
    password: hash,
    token: uid2(32)
 
  })
   userSave = await newUser.save();
  console.log(userSave)

  
    if(userSave){
    result = true
    token = userSave.token
  }
 }
 
  //(2.4) Renvoi de la réponse au Frontend
  res.json({result, userSave, error, token});


});
//(2.10) création d'une nouvelle route nommée /sign-in qui se chargera de vérifier l'existence en base de données d’un utilisateur
router.post('/sign-in', async function(req,res,next){

  
  var result = false
  var user = null
  var error = []
  var token = null

  if(req.body.email == ''
  || req.body.password == ''
  ){
    error.push('champs vides')
  }
  if(error.length == 0) {
//(2.11) requête permettant de rechercher un utilisateur en base de données
  const user = await userModel.findOne({ 
    email: req.body.email,
    //password: req.body.password,

  })

  //(4.4) Vérifiecation que le mot de passe chiffré correspond à celui enregistré en base de données.
    if(bcrypt.compareSync(req.body.password, user.password)){
  result = true
  token = user.token
   } else {
   result = false
   error.push('mot de passe incorrect')
  } 
  }  else {
    error.push('email incorrect')
  }
//(2.12) Renvoi de la réponse au Frontend
   res.json({result, user, error, token});

})

router.post('/wishlist-article', async function(req, res, next) { 

  var result = false
  var user = await userModel.findOne({token: req.body.token})

    if(user != null){
         var newArticle = new articleModel({      
            title: req.body.name, 
            description: req.body.desc,
            urlToImage: req.body.img,      
            content: req.body.content,       
            lang: req.body.lang,
            userId: user._id,          
          })        
          var articleSave = await newArticle.save()       
            
           if(articleSave.name){       
             result = true     
             }   
           }    
            res.json({result})   
          });

// Suppression d'un film dans la db
router.delete('/wishlist-artilce', async function(req, res, next) {

  var result = false
  var user = await userModel.findOne({token: req.body.token})

  if(user != null){
  var returnDb = await articleModel.deleteOne({title: req.body.title, userId: user._id})

  
  if(returnDb.deletedCount == 1) {
    result = true; 
   }
}
  res.json({result});
})

router.get('/wishlist-articles', async function(req, res, next){

  var articles = []
  var user = await userModel.findOne({token: req.body.token})

  if(user != null){
    if(req.query.lang!== ''){
      articles = await articleModel.find({userId:user._id, lang: req.query.lang})
    } else {
      articles = await articleModel.find({userId:user._id})
    }

    
  }
  
  res.json({articles})
})

router.get('/user-lang', async function(req, res, next){

  var lang = null
  var user = await userModel.findOne({token: req.body.token})

  if(user != null){
   lang = user.lang
    
  }
  
  res.json({lang})
})

router.post('/user-lang', async function(req, res, next){

  var result = false
 
  var user = await userModel.updateOne({token: req.body.token}, {lang: req.body.lang})

  if(user != null){
   result = true
    
  }
  
  res.json({result})
})








module.exports = router;
