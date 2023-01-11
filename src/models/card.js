const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  code: {
    type: String,
    require: true,
    trim: true,
  },
  type: {
    type: String,
    require: true,
    enum: ['Lava Smile', 'Lava Gold', 'Lava Platinum', 'Lava Diamond'],
    default: 'Lava Smile',
  },
  period: {
    type: String,
    enum: ['10', '15', '20', 'Unlimited'],
    default: '10',
  },
  activeDate: {
    type: Date,
  },
  expired: {
    type: Boolean,
    require: true,
    default: false,
  },
  fullName: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  birthOfDate: {
    type: String,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  mail: {
    type: String,
    trim: true,
  },
});

cardSchema.pre('save', async function (next) {
  const card = this;

  if (card.type === 'Lava Gold') {
    card.period = '15';
  }
  if (card.type === 'Lava Platinum') {
    card.period = '20';
  }
  if (card.type === 'Lava Diamond') {
    card.period = 'Unlimited';
  }

  next();
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
