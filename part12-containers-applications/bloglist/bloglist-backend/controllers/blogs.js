const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')
const user = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', userExtractor, async (request, response) => {
    if (!request.body.title || !request.body.url) {
        return response.status(400).end()
    }
    const user = request.user
    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes || 0,
        user: user._id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    const user = request.user
    if (blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndRemove(blog.id)
        return response.status(204).end()
    }
    return response.status(401).json({error: 'Not authorized'})
    
})

blogsRouter.put('/:id', async (request, response) => {
    const updatedeBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, {new: true})
    response.json(updatedeBlog.toJSON())
})

module.exports = blogsRouter