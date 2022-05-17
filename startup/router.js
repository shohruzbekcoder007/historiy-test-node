const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const use_router = require('../routers/user')
const question_router = require('../routers/question')
const answer_router = require('../routers/answer')
const test_router = require('../routers/app_test')
const category = require('../routers/category')
const try_test = require('../routers/try_test')
const full_test = require('../routers/create_full_test')
const correct_answer = require('../routers/correct_answer')
const errorMiddleware = require('../middleware/error')
const options = require("../swagger.json")
const specs = swaggerJsdoc(options)

module.exports = (app) => {
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    app.use('/v1/user', use_router);
    app.use('/v1/question', question_router);
    app.use('/v1/answer', answer_router);
    app.use('/v1/test', test_router);
    app.use('/v1/category', category);
    app.use('/v1/trytest', try_test);
    app.use('/v1/correctanswers', correct_answer);
    app.use('/v1/fulltest', full_test);
    app.use(errorMiddleware);
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(specs
            // ,{ explorer: true }
        )
    );
}