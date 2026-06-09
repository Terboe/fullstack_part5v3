import Blog from './Blog'

const BlogList = ({ blogs, updateBlog, deleteBlog, user }) => {
  return (
    <div>
      <h2>Blogs</h2>

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            update={updateBlog}
            dele={deleteBlog}
            currentUser={user}
          />
        ))}
    </div>
  )
}

export default BlogList