const mongoose = require('mongoose');


var articleSchema = mongoose.Schema({
    title: String,
    content: String,
    image: String,
  
  });
  
var articleModel = mongoose.model('article', articleSchema);

module.exports = articleModel