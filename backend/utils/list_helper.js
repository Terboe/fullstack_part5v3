const dummy = (blogs) => {
  return 1
}


const totalLikes = (blogs) => {
    let a = 0
    if(blogs.length === 0){
        return 0
    }
    blogs.forEach(element => {
        a += element.likes
    });
    return a
}

const favoriteBlog = (blogs) => {
    let a = {}
    let p = 0
    if(blogs.length === 0){
        return {}
    }
    blogs.forEach(b =>{
        if (b.likes > p){
            a = b
            p = b.likes
        }
    })
    return a
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return {}
  }

  const blogCounts = {}

  blogs.forEach(blog => {
    if (!blogCounts[blog.author]) {
      blogCounts[blog.author] = 0
    }

    blogCounts[blog.author] += 1
  })

  let topAuthor = null
  let topCount = 0

  Object.entries(blogCounts).forEach(([author, blogs]) => {
    if (blogs > topCount) {
      topAuthor = author
      topCount = blogs
    }
  })

  return {
    author: topAuthor,
    blogs: topCount,
  }
}


const mostLikes = blogs => {
  if (blogs.length === 0) {
    return {}
  }

  const blogCounts = {}

  blogs.forEach(blog => {
    if (!blogCounts[blog.author]) {
      blogCounts[blog.author] = 0
    }

    blogCounts[blog.author] += blog.likes
  })

  let topAuthor = null
  let topCount = 0

  Object.entries(blogCounts).forEach(([author, blogs]) => {
    if (blogs > topCount) {
      topAuthor = author
      topCount = blogs
    }
  })

  return {
    author: topAuthor,
    likes: topCount,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

