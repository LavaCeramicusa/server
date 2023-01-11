const mongoose = require('mongoose');
const bcrybt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { cloneDeep } = require('lodash');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    trim: true,
  },
  password: {
    type: String,
    require: true,
    minLength: 8,
    trim: true,
  },
  secret: {
    type: String,
    default: '',
  },
});

userSchema.methods.toJson = function () {
  const user = cloneDeep(this.toObject());

  delete user.password;
  delete user.secret;

  return user;
};

userSchema.methods.generateAuthToken = function () {
  const user = this;

  const token = jwt.sign(
    { _id: user._id.toString() },
    `e-sell_access_token_secret`,
    {
      expiresIn: '3d',
    }
  );

  return token;
};

userSchema.statics.findByCredentials = async (username, password) => {
  const error = 'Username or password is incorrect!';

  const user = await User.findOne({ username });
  if (!user) {
    throw new Error(error);
  }

  const isMatchPassword = await bcrybt.compare(password, user.password);
  if (!isMatchPassword) {
    throw new Error(error);
  }

  return user;
};

userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  const salt = await bcrybt.genSalt(10);
  const hash = await bcrybt.hash(user.password, salt);

  user.password = hash;

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
