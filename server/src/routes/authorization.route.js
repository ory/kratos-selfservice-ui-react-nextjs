const express = require("express")
const router = express.Router()
const authorizationController = require("../controllers/authorization.controller")

router.get("/", authorizationController.authorizeUser)

module.exports = router
