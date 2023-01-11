const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/user');

const router = express.Router();

router.post('/secret/register', async (req, res) => {
  try {
    const { username, password, secret } = req.body;

    if (secret !== 'camellia') {
      return res.status(400).send('Invalid!');
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).send('Username has already exists!');
    }

    const newUser = new User({
      username,
      password,
    });

    await newUser.save();
    res.status(201).send('Created successfully.');
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username);

    if (!username || !password) {
      return res.status(500).send('You need to input username and password!');
    }

    const user = await User.findByCredentials(username, password);

    const token = await user.generateAuthToken();
    res.send({
      token_type: 'Bearer',
      access_token: token,
      refresh_token: '',
      expired_in: new Date().getTime() + 3 * 24 * 60 * 60 * 1000,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/users/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    if (!_id) {
      return res.status(400).send('User id invalid!');
    }

    const user = await User.findById({ _id });
    if (!user) {
      return res.status(404).send('User not found!');
    }

    await User.deleteOne({ _id });
    res.send('Deleted successfully.');
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/test', (req, res) => {
  try {
    res.send(`Test: ${process.env.CLIENT_URI}`);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
