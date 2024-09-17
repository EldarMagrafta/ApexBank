const route = require("express").Router();
const authController = require("../controllers/auth");

route.post("/register", authController.registerUser);
route.post("/login", authController.loginUser);
route.get("/verify", authController.verifyEmail);

module.exports = route;
