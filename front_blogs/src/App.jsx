import { useEffect, useRef, useState } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { Container } from '@mui/material'
import { TextField, Button, Alert, AppBar, Toolbar } from '@mui/material'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

import BlogList from './components/BlogList'
import Footer from './components/Footer'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity={message.type}>
      {message.text}
    </Alert>
  )
}

const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin,
}) => (
  <form onSubmit={handleLogin}>
    <div>
      <label>
        username
        <TextField
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </label>
    </div>

    <div>
      <label>
        password
        <TextField
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </label>
    </div>

    <Button type="submit">login</Button>
  </form>
)

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  const showNotification = (notification) => {
    setNotification(notification)

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()

      const createdBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(createdBlog))
      showNotification({
        text: `a new blog ${createdBlog.title} added`,
        type: 'success',
      })
      navigate('/')
    } catch {
      showNotification({
        text: 'creating a new blog failed',
        type: 'error',
      })
    }
  }

  const deleteBlog = async (blogId) => {
    try {
      await blogService.dele(blogId)

      setBlogs(blogs.filter((blog) => blog.id !== blogId))
      showNotification({
        text: 'blog deleted',
        type: 'success',
      })
      navigate('/')
    } catch {
      showNotification({
        text: 'deleting a blog failed',
        type: 'error',
      })
    }
  }

  const updateBlog = async (blogObject, id) => {
    try {
      const updatedBlog = await blogService.update(blogObject, id)

      setBlogs(blogs.map((blog) => (
        blog.id === updatedBlog.id ? updatedBlog : blog
      )))
    } catch {
      showNotification({
        text: 'liking a blog failed',
        type: 'error',
      })
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedUser = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedUser),
      )

      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      showNotification({
        text: 'wrong username or password',
        type: 'error',
      })
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const BlogView = () => {
    const { id } = useParams()
    const blog = blogs.find((blog) => blog.id === id)

    if (!blog) {
      return <div>Blog not found</div>
    }

    return (
      <Blog
        blog={blog}
        update={updateBlog}
        dele={deleteBlog}
        currentUser={user}
        show={true}
      />
    )
  }

  const padding = {
    padding: 5,
  }

  return (
    <Container>
      <div>
        <AppBar position='static'>
          <Toolbar>
          <Button color="inherit" component={Link} to="/">blogs</Button>
          <Button color="inherit" component={Link} to="/login">log in</Button>
          <Button color="inherit" component={Link} to="/create">new blog</Button>
          </Toolbar>
        </AppBar>

        <Notification message={notification} />

        {user && (
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>log out</button>
          </p>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <div>
                <BlogList
                  blogs={blogs}
                  updateBlog={updateBlog}
                  deleteBlog={deleteBlog}
                  user={user}
                />
              </div>
            }
          />

          <Route
            path="/blogs/:id"
            element={<BlogView />}
          />

          <Route
            path="/login"
            element={
              user
                ? <p>You are already logged in</p>
                : (
                  <LoginForm
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                    handleLogin={handleLogin}
                  />
                )
            }
          />

          <Route
            path="/create"
            element={
              user && (
                <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                  <BlogForm createBlog={addBlog} />
                </Togglable>
              )
            }
          />
        </Routes>

        <Footer />
      </div>
    </Container>
  )
}

export default App