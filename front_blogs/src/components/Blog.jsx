import { Link } from 'react-router-dom'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from '@mui/material'

const Blog = ({ blog, update, dele, currentUser, show = false }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    }

    await update(newBlog, blog.id)
  }

  const deleteBlog = async (event) => {
    event.preventDefault()
    await dele(blog.id)
  }

  const blogUserId = blog.user?.id || blog.user
  const currentUserId = currentUser?.id

  const showRemoveButton = blogUserId === currentUserId

  if (!show) {
    return (
      <div data-testid="blog" style={blogStyle}>
        <Link to={`/blogs/${blog.id}`}>
          {blog.title} {blog.author}
        </Link>
      </div>
    )
  }

  return (
    <Card data-testid="blog" sx={{ mt: 2, mb: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {blog.title}
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Author:</strong> {blog.author}
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Url:</strong> {blog.url}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="body1">
            <strong>Likes:</strong> {blog.likes}
          </Typography>

          {currentUser?.id && (
            <Button variant="contained" size="small" onClick={handleLike}>
              like
            </Button>
          )}
        </Box>

        {showRemoveButton && (
          <Button variant="outlined" color="error" onClick={deleteBlog}>
            remove
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default Blog