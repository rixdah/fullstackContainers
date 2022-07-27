const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {user: 0})
    response.json(users.map(user => user.toJSON()))
})

userRouter.post('/', async (request, response) => {
    const body = request.body
    if (body.password === undefined || body.password.length < 3) {
        return response.status(400).json({error: 'Password should have at least 3 characters'})
    }
    const passwordHash = await bcrypt.hash(body.password, 10)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = userRouter