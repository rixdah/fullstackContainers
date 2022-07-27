import React, { useState } from 'react'

const Blog = ({ blog, updateBlog, user, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const showRemove = { display: blog.user.username === user.username ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const incrementLikes = async () => {
    const newBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    await updateBlog(blog.id, newBlog)
  }

  const deleteBlog = async () => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await removeBlog(blog.id)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className='hiddenInfo'>
        {blog.title} {blog.author} <button id='view-button' onClick={toggleVisibility}>View</button>
      </div>
      <div style={showWhenVisible} className='fullInfo'>
        <div>{blog.title} {blog.author} <button id='hide-button' onClick={toggleVisibility}>Hide</button></div>
        <div>{blog.url}</div>
        <div>Likes: {blog.likes} <button id='like-button' onClick={incrementLikes}>Like</button></div>
        <div>{blog.user.name}</div>
        <div style={showRemove}><button id='remove-button' onClick={deleteBlog}>Remove</button></div>
      </div>
    </div>
  )
}

export default Blog