const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
})

test('users with validation errors are not added', async () => {
    let usersBefore = await helper.usersInDb()
    const userWithShortPassword = {
        username: 'short_pass',
        name: 'Jari',
        password: 'yo'
    }

    const userWithShortUsername = {
        username: 'yo',
        name: 'Jori',
        password: 'good_password'
    }

    const workingUserObject = {
        username: 'username',
        name: 'user',
        password: 'password'
    }

    const userWithRepeatUsername = {
        username: 'username',
        name: 'duplicate',
        password: 'psswrd'
    }

    await api
        .post('/api/users')
        .send(userWithShortPassword)
        .expect(400)
        .expect({error: 'Password should have at least 3 characters'})
    
    let usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length)
    expect(usersAfter).not.toContainEqual(userWithShortPassword)

    await api
        .post('/api/users')
        .send(userWithShortUsername)
        .expect(400)
        .expect({error: 'User validation failed: username: Path `username` (`yo`) is shorter than the minimum allowed length (3).'})

    usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length)
    expect(usersAfter).not.toContainEqual(userWithShortUsername)

    await api
        .post('/api/users')
        .send(workingUserObject)
        .expect(201)
    
    usersBefore = await helper.usersInDb()

    await api
        .post('/api/users')
        .send(userWithRepeatUsername)
        .expect(400)
        .expect({error: 'User validation failed: username: Error, expected `username` to be unique. Value: `username`'})

    usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length)
    expect(usersAfter).not.toContainEqual(userWithRepeatUsername)
})

afterAll(() => {
    mongoose.connection.close()
})