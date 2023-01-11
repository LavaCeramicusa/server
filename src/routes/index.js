const express = require('express');
const cardRouter = require('./card');
const userRouter = require('./user');

const router = express.Router();

router.use('/cards', cardRouter);
router.use(userRouter);

module.exports = router;
