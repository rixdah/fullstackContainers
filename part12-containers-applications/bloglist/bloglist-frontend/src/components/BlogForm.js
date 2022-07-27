import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ addBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const createBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    addBlog(blogObject)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')

  }

  return(
    <div>
      <h2>Create new</h2>
      <form onSubmit={createBlog}>
        <div>Title:<input
          id='title'
          type='text'
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
          placeholder='Title of the blog'
        /></div>
        <div>Author:<input
          id='author'
          type='text'
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
          placeholder='Author of the blog'
        /></div>
        <div>Url:<input
          id='url'
          type='text'
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
          placeholder='Url for the blog'
        /></div>
        <button id='create-button' type="submit">Create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired
}

export default BlogForm