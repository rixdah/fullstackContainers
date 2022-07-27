const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (previous, current) => {
        return (previous.likes > current.likes) ? previous : current
    }
    if (blogs.length === 0) {
        return -1
    }
    return blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
    const authors = []
    let blogAmount = _.reduce(blogs, (total, next) => {
        total[next.author] = (total[next.author] || 0) + 1
        return total
    }, {})
    for (const author in blogAmount) {
        authors.push({author: author, blogs: blogAmount[author]})
    }
    const reducer = (previous, current) => {
        return (previous.blogs > current.blogs) ? previous : current
    }

    if (authors.length === 0) {
        return -1
    }
    return authors.reduce(reducer)
}

const mostLikes = (blogs) => {
    const authors = []
    let likeAmount = _.reduce(blogs, (total, next) => {
        total[next.author] = (total[next.author] || 0) + next.likes
        return total
    }, {})
    for (const author in likeAmount) {
        authors.push({author: author, likes: likeAmount[author]})
    }
    const reducer = (previous, current) => {
        return (previous.likes > current.likes) ? previous : current
    }

    if (authors.length === 0) {
        return -1
    }
    return authors.reduce(reducer)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}