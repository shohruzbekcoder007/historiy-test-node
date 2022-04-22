const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Tarixdan test savollari",
      version: "0.1.0",
      description:
        "Android va web dasturchilarga api lar bilan ishlash uchun qo'llanma",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8080/books",
      },
    ],
  },
  apis: ["./routes/user.js"],
};

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

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.listen(8080, err => {
    if(err)
        console.error(err);
    else
        console.log(`8080 portni tinglash boshlandi!!!`);
})