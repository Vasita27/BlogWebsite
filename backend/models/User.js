const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:{type: String,required: true,unique:true},
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'contentCreator'], default: 'user' }, // Default role is 'user'
  resetToken : {type:String},
  tokenExpiration : {type : Date}
});

module.exports = mongoose.model('User', userSchema,"blog_clients");
