const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
}, { timestamps: true })

userSchema.methods.comparePassword = (password, hash, callback) => {
  bcrypt.compare(password, hash, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch)
  })
}

userSchema.methods.createUser = (user, callback) => {
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return callback(err)
    user.password = hash;
    user.save(callback)
  })
}

const ModelClass = mongoose.model('user', userSchema)
module.exports = ModelClass
