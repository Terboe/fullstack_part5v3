const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const assert = require('node:assert')

const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'a',
    author: 'aa',
    url: 'a.com',
    likes: 1,
  },
  {
    title: 'b',
    author: 'bb',
    url: 'b.com',
    likes: 2,
  },
]

let token
let testUserId

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const testUser = {
    username: 'testuser',
    name: 'test',
    password: 'test',
  }

  const userResponse = await api
    .post('/api/users')
    .send(testUser)

  testUserId = userResponse.body.id

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'test',
    })

  token = loginResponse.body.token

  const blogsWithUser = initialBlogs.map(blog => ({
    ...blog,
    user: testUserId,
  }))

  let blogObject = new Blog(blogsWithUser[0])
  await blogObject.save()

  blogObject = new Blog(blogsWithUser[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blog id field is named id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'newt',
    author: 'newa',
    url: 'new.new',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const authors = response.body.map(blog => blog.author)

  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  assert(authors.includes('newa'))
})

test('likes default to zero if not given', async () => {
  const newBlog = {
    title: 'newt',
    author: 'newa',
    url: 'new.new',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'tester',
    url: 'notitle.com',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'blog without url',
    author: 'tester',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('a blog can be deleted by its creator', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')

  assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)

  const titles = blogsAtEnd.body.map(blog => blog.title)
  assert(!titles.includes(blogToDelete.title))
})

test('a blog cannot be added without token', async () => {
  const newBlog = {
    title: 'no token blog',
    author: 'tester',
    url: 'notoken.com',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})