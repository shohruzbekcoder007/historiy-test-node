const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/test_history', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDBga ulanish hosil qilindi...');
  })
  .catch((err) => {
    console.error('MongoDBga ulanish vaqtida xato ro\'y berdi...', err);
  });

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const use_router = require('./routers/user');
app.use('/v1/user',use_router);

app.listen(8080, err => {
    if(err)
        console.log(err)
    else
        console.log(`8080 portni tinglash boshlandi!!!`);
})