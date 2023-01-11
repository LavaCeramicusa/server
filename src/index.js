const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
// const upload = require('convert-excel-to-json');

const connect = require('./config/database');
const router = require('./routes/index');
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
// app.use(upload());
app.disable('x-powered-by');

app.use(router);

app.get('/', (req, res) => {
  res.send(`APP IS RUNNING`);
});

app.listen(port, async () => {
  console.log(`Serve run on the ${port} port.`);
  await connect();
});
