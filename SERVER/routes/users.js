const router = require('express').Router()
const userController = require("../controllers/user")

const userRoutes = (app) => {
    router.get("/all", userController.allUsers)
    router.get("/:id", userController.getUserById)
    router.post("/register", userController.register)
    router.get("/balance/:id", userController.getBalance)
    router.get("/balance/:id/:debt", userController.getDebt)
    router.get("/buy/:id/:amount", userController.buyUnits)
    router.post("/login", userController.login)
    router.patch("/:id", userController.updateUser)
    router.get("/count/api", userController.countUsers)
    router.get("/reset/amount/1", userController.setZeroAmount)
    router.get("/setunit/:unit", userController.setAmount)
    return app.use("/user", router)
}

module.exports = {
    userRoutes
}