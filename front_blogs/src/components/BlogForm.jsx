import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async event => {
    event.preventDefault()

    const newBlog = {
      title,
      author,
      url
    }

    await createBlog(newBlog)

    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <>
      <h2>Create new</h2>

      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">title:</label>
          <TextField
            id="title"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="author">author:</label>
          <TextField
            id="author"
            value={author}
            onChange={event => setAuthor(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="url">url:</label>
          <TextField
            id="url"
            value={url}
            onChange={event => setUrl(event.target.value)}
          />
        </div>

        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>create</Button>
      </form>
    </>
  )
}

export default BlogForm