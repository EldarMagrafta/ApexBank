const route = require("express").Router();
const {createBankAccount, getAccount} = require("../controllers/account");
const {authenticate, authorize} = require("../middleware/auth");

route.post("/", authenticate, createBankAccount);
route.get("/:account_number", authenticate, getAccount);

module.exports = route;
