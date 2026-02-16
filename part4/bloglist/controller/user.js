const User = require('../models/User')
const bcrypt = require('bcryptjs')

const createUser = async (request, response) => {
    const { username, name, password } = request.body
    if (!password || password.length < 3) {
        return response.status(400).json({ error: 'Password must be at least 3 characters long' })
    }

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return response.status(400).json({ error: 'Username must be unique' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
}

const loginUser = async (request, response) => {
    const { username, password } = request.body
    const user = await User.findOne({ username })
    if (!user) {
        return response.status(401).json({ error: 'Invalid username or password' })
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordCorrect) {
        return response.status(401).json({ error: 'Invalid username or password' })
    }
    response.json(user)
}

module.exports = {
    createUser,
    loginUser,
}