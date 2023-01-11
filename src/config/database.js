const mongoose = require('mongoose');

const connect = async () => {
  // const URI = `mongodb+srv://Admin:nLXi2j9141d8LOmL@cluster0.0z9t5mz.mongodb.net/?retryWrites=true&w=majority`;
  const URI = `mongodb+srv://admin:Ks1f1xxsz5sx3036@cluster0.jmokivk.mongodb.net/?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(`${URI}`);
    console.log('Connection to DB.');
  } catch (err) {
    console.log('Mongoose connection failed: ', err);
    process.exit(1);
  }
};

module.exports = connect;
