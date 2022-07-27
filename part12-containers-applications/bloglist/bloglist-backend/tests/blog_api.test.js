const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
    const testingUser = {
        username: 'testing_user',
        name: 'Tester',
        password: 'password_for_testing'
    }
    await api
        .post('/api/users')
        .send(testingUser)
})

test('right amount of JSON-formatted blogs returned', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})


test('returned blogs have identifier "id"', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
        expect(blog.id).toBeDefined()
    })
})

test('HTTP POST to /api/blogs works correctly', async () => {
    const newBlog = {
        title: 'New testing blog',
        author: 'Riku',
        url: 'urlfortesting.com',
        likes: 45
    }
    const loginInfo = await api
        .post('/api/login')
        .send({username: 'testing_user', password: 'password_for_testing'})

    const token = JSON.parse(loginInfo.text).token
    let auth = 'Bearer '
    auth = auth.concat(token.toString())
    await api
        .post('/api/blogs')
        .set('Authorization', auth)
        .send(newBlog)
        .expect(201)

    const response = await api.get('/api/blogs')
    const contents = response.body.map(blog => blog.title)
    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(contents).toContain('New testing blog')
})

test('likes field gets value 0 when no value is given', async () => {
    const blogWithNoLikesValue = {
        title: 'No likes given for this blog',
        author: 'Riku',
        url: 'nolikes.com'
    }

    const loginInfo = await api
        .post('/api/login')
        .send({username: 'testing_user', password: 'password_for_testing'})

    const token = JSON.parse(loginInfo.text).token
    let auth = 'Bearer '
    auth = auth.concat(token.toString())
    await api
        .post('/api/blogs')
        .set('Authorization', auth)
        .send(blogWithNoLikesValue)
        .expect(201)
    
    const response = await api.get('/api/blogs')
    expect(response.body[response.body.length - 1].likes).toBe(0)
})

test('posting a blog with no title and url gets the status code 400 as response', async () => {
    const blogWithNoTitleAndUrl = {
        author: 'Riku',
        likes: 1
    }
    const loginInfo = await api
        .post('/api/login')
        .send({username: 'testing_user', password: 'password_for_testing'})

    const token = JSON.parse(loginInfo.text).token
    let auth = 'Bearer '
    auth = auth.concat(token.toString())
    await api
        .post('/api/blogs')
        .set('Authorization', auth)
        .send(blogWithNoTitleAndUrl)
        .expect(400)
})

test('deleting a blog works correctly', async () => {
    const newBlog = {
        title: 'New testing blog',
        author: 'Riku',
        url: 'urlfortesting.com',
        likes: 45
    }

    const loginInfo = await api
        .post('/api/login')
        .send({username: 'testing_user', password: 'password_for_testing'})

    const token = JSON.parse(loginInfo.text).token
    let auth = 'Bearer '
    auth = auth.concat(token.toString())
    await api
        .post('/api/blogs')
        .set('Authorization', auth)
        .send(newBlog)
        .expect(201)
    
    const blogsBefore = await helper.blogsInDb()
    await api
        .delete(`/api/blogs/${blogsBefore[blogsBefore.length - 1].id}`)
        .set('Authorization', auth)
        .expect(204)

    const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter).toHaveLength(blogsBefore.length - 1)
    expect(blogsAfter).not.toContainEqual(blogsBefore[blogsBefore.length - 1])
})

test('updating a blog works correctly', async () => {
    const blogsBefore = await helper.blogsInDb()
    const changedBlog = {
        title: 'HTTP PUT works',
        author: 'Riku',
        url: 'nice.com',
        likes: 42
    }
    await api
        .put(`/api/blogs/${blogsBefore[0].id}`)
        .send(changedBlog)
        .expect(200)
    
    const blogsAfter = await helper.blogsInDb()
    
    expect(blogsAfter[0].title).toBe(changedBlog.title)
})

test('returns 401 when POST request does not have a token', async () => {
    const newBlog = {
        title: 'New testing blog',
        author: 'Riku',
        url: 'urlfortesting.com',
        likes: 45
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
})

afterAll(() => {
    mongoose.connection.close()
})