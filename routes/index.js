const express = require('express');
const container = require('../container'); 

module.exports = function createRoutes() {
    const { userController } = container.cradle;
    const router = express.Router();
    
    // Add routes using the resolved controller
    router.get("/user", userController.getUser);

    return router;
};