const {createUser,loginUser} = require('../controller/user')
const usersRouter = require('express').Router()

usersRouter.post('/', createUser)
usersRouter.post('/login', loginUser)

module.exports = usersRouter