const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

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
const question_router = require('./routers/question');
const answer_router = require('./routers/answer');
const test_router = require('./routers/test');
const fulltest = require('./routers/rate_and_test_answer')

app.use('/v1/user', use_router);
app.use('/v1/question', question_router);
app.use('/v1/answer', answer_router);
app.use('/v1/test', test_router);
app.use('/v1/fulltest', fulltest);


const  options  = require("./swagger.json");
const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs
    // ,{ explorer: true }
  )
);

app.listen(8080, err => {
    if(err)
        console.error(err);
    else
        console.log(`8080 portni tinglash boshlandi!!!`);
})