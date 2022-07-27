import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Toggleable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationSeverity, setNotificationSeverity] = useState('green')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationSeverity('red')
      setNotificationMessage('Wrong username or password')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 3000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedUser')
  }

  const addBlog = async blogObject => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setNotificationSeverity('green')
    setNotificationMessage(`A new blog ${blogObject.title} by ${blogObject.author} added`)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 4000)
  }

  const updateBlog = async (id, blogObject) => {
    await blogService.update(id, blogObject)
    const blogs = await blogService.getAll()
    setBlogs( blogs )
  }

  const removeBlog = async id => {
    await blogService.remove(id)
    blogService.getAll().then(blogs => setBlogs(blogs))
  }

  const sortBlogs = () => {
    blogs.sort((a, b) => b.likes - a.likes)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notificationMessage} notificationSeverity={notificationSeverity} />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={notificationMessage} notificationSeverity={notificationSeverity} />
      <div>
        {user.name} logged in <button onClick={handleLogout}>Logout</button>
      </div><br/>
      <Toggleable buttonLabel='Create new blog' ref={blogFormRef}>
        <BlogForm addBlog={addBlog}/>
      </Toggleable><br/>
      {sortBlogs()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} user={user} removeBlog={removeBlog} />
      )}
    </div>
  )
}

export default App