import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import FormLogin from './components/FormLogin'
import FormBlog from './components/FormBlog'
import Togglable from './components/Toggable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')
  const noteFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type) => {
    setMessage(message)
    setMessageType(type)
    setTimeout(() => {
      setMessage(null)
      setMessageType(null)
    }, 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      showNotification(`Welcome ${user.name}!`, 'success')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const addLikeToBlog = async (blogObject) => {
    const blogToUpdate = {
      user: blogObject.user.id,
      likes: blogObject.likes + 1,
      author: blogObject.author,
      title: blogObject.title,
      url: blogObject.url,
    }

    try {
      const returnedBlog = await blogService.update(blogObject.id, blogToUpdate)

      const updatedBlog = {
        ...returnedBlog,
        user: blogObject.user,
      }

      setBlogs(
        blogs.map((blog) => (blog.id === returnedBlog.id ? updatedBlog : blog))
      )
      showNotification(
        `a blog ${returnedBlog.title} by ${returnedBlog.author} has been liked`,
        'success'
      )
    } catch {
      showNotification('Failed to like the blog', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    showNotification('Logged out successfully', 'success')
  }

  const removeBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      showNotification('Blog removed successfully', 'success')
    } catch  {
      showNotification('Failed to remove blog', 'error')
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      noteFormRef.current.toggleVisibility()
      showNotification(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        'success'
      )
    } catch {
      showNotification('Failed to create a blog', 'error')
    }
  }



  if (user === null) {
    return (
      <div>
        <Notification message={message} messageType={messageType} />
        <FormLogin handleLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} messageType={messageType} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={noteFormRef}>
        <FormBlog createBlog={addBlog} />
      </Togglable>

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} addLikeToBlog={addLikeToBlog}  removeBlog={removeBlog} user={user} />
        ))}
    </div>
  )
}

export default App
