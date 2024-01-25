const express = require("express");
const cors = require("cors");
const path = require("path");
const errorMiddleware = require('../middleware/error.middleware');
const userRouter = require('../routes/admin-app/user.route');
const categoryRouter = require('../routes/admin-app/category.route');
const ProjectRouter = require('../routes/admin-app/project.route');

const HttpException = require('../utils/HttpException.utils');

module.exports = function(app){
        // parse requests of content-type: application/json
        // parses incoming requests with JSON payloads
        app.use(express.json());
        // enabling cors for all requests by using cors middleware
        app.use(cors());
        // Enable pre-flight
        app.options("*", cors());
        app.use(`/api/v1/admin-app/user`, userRouter);
        app.use(`/api/v1/admin-app/category`, categoryRouter);
        app.use(`/api/v1/admin-app/project`, ProjectRouter);
        app.use(`/api/v1/admin-app/images`, express.static('upload'));
        app.use(`/api/v1/admin-app/cat_img`, express.static('upload'));

        // 404 error
        app.all('*', (req, res, next) => {
            const err = new HttpException(404, 'Endpoint Not Found');
            next(err);
        });
        
        app.use(errorMiddleware);
}