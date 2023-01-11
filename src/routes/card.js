const express = require('express');
// const importExcel = require('convert-excel-to-json');
const upload = require('express-fileupload');
const Formiable = require('formidable');
const bluebird = require('bluebird');
const fs = bluebird.promisifyAll(require('fs'));
const { auth } = require('../middleware/auth');
const Card = require('../models/card');
const { join } = require('path');

const router = express.Router();

// router.get('/', async (req, res) => {
//   try {
//     const { limit, offset } = req.query;
//     const total = await Card.count();
//     const cards = await Card.find({}).skip(offset).limit(limit);

//     res.send({
//       offset,
//       limit,
//       totalAvailable: total,
//       data: cards,
//     });
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

router.get('/:id', async (req, res) => {
  try {
    const _id = req.params.id;

    if (!_id) {
      return res.status(400).send({ message: 'Missing input value!' });
    }

    const card = await Card.findOne({ code: _id });

    if (!card) {
      return res.status(404).send({ message: 'Card not found!' });
    }
    res.send(card);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const { code, type, secret } = req.body;
    if (!code || !type || secret !== 'LavaCeramicusa') {
      return res.status(400).send('Invalid!');
    }

    const card = await Card.findOne({ code });
    if (card) {
      return res.status(400).send('Card has already exists!');
    }

    const newCard = new Card({
      code,
      type,
    });
    await newCard.save();
    res.status(201).send('Created successfully.');
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/demo', async (req, res) => {
  const form = Formiable.IncomingForm();
  const uploadsFolder = join(__dirname, 'dist', 'uploads');
  form.multiples = true;
  form.maxFileSize = 50 * 1024 * 1024;
  form.uploadDir = uploadsFolder;
});

router.post('/upload', async (req, res) => {
  try {
    console.log('in', req.body);
    console.log('innnn', req.files);
    if (!req.files) {
      return res.status(400).send({ message: 'Upload failed!' });
    }

    console.log('files', req.files);

    const file = req.files.file;
    const filename = file.name;

    console.log('file name', filename);

    file.mv('./uploads', filename, function (err) {
      if (err) {
        return res.status(400).send(err);
      }
      res.send('File uploaded.');
    });
  } catch (err) {
    res.status(500).send(err);
  }

  // file.mv('./excel/' + filename, (err) => {
  //   if (err) {
  //     return res.send('Upload failed!');
  //   } else {
  //     const result = importExcel({
  //       sourceFile: `/excel/${filename}`,
  //     });
  //     res.send(result);
  //   }
  // });
});

router.patch('/active', async (req, res) => {
  try {
    const { code, fullName } = req.body;
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      'code',
      'fullName',
      'gender',
      'birthOfDate',
      'address',
      'phoneNumber',
      'mail',
    ];

    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
      return res.status(400).send({ message: 'Invalid!' });
    }

    if (!code || !fullName) {
      return res.status(400).send({ message: 'Invalid!' });
    }

    const card = await Card.findOne({ code });
    if (!card) {
      return res.status(404).json({ message: 'Invalid!' });
    }
    if (card.fullName) {
      return res.status(400).send({ message: 'Card has already active!' });
    }

    updates.forEach((update) => (card[update] = req.body[update]));
    card.activeDate = new Date();
    await card.save();
    res.send('Active successfully.');
  } catch (err) {
    res.status(500).send(err);
  }
});

// router.delete('/:id', auth, async (req, res) => {
//   try {
//     const _id = req.params.id;
//     if (!_id) {
//       return res.status(400).send('Invalid Code!');
//     }

//     await Card.deleteOne({ code: _id });
//     res.send('Deleted successfully.');
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

module.exports = router;
