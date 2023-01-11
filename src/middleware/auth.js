const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ err: 'Please authentication.' });
    }
    const decode = jwt.verify(token, `e-sell_access_token_secret`);
    const user = User.findById(decode._id);

    if (!user) {
      return res.status(500).send({ err: 'User not exists. ' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ err: 'Please authentication.' });
  }
};

module.exports = {
  auth,
};
