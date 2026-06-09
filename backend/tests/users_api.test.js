const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const bcrypt = require('bcrypt')

const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)

  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash,
  })

  await user.save()
})

test('a valid user can be created', async () => {
  const usersAtStart = await api.get('/api/users')

  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await api.get('/api/users')

  assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length + 1)

  const usernames = usersAtEnd.body.map(user => user.username)
  assert(usernames.includes(newUser.username))
})

test('user with too short username is not created', async () => {
  const usersAtStart = await api.get('/api/users')

  const newUser = {
    username: 'ab',
    name: 'Short Username',
    password: 'validpassword',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error)

  const usersAtEnd = await api.get('/api/users')

  assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
})

test('user with too short password is not created', async () => {
  const usersAtStart = await api.get('/api/users')

  const newUser = {
    username: 'validusername',
    name: 'Short Password',
    password: 'ab',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error)

  const usersAtEnd = await api.get('/api/users')

  assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
})

test('user without username is not created', async () => {
  const usersAtStart = await api.get('/api/users')

  const newUser = {
    name: 'No Username',
    password: 'validpassword',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error)

  const usersAtEnd = await api.get('/api/users')

  assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
})

test('user without password is not created', async () => {
  const usersAtStart = await api.get('/api/users')

  const newUser = {
    username: 'nopassword',
    name: 'No Password',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error)

  const usersAtEnd = await api.get('/api/users')

  assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
})

test('user with non-unique username is not created', async () => {
  const usersAtStart = await api.get('/api/users')

  const newUser = {
    username: 'root',
    name: 'Duplicate Username',
    password: 'validpassword',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error)

  const usersAtEnd = await api.get('/api/users')

  assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
})

after(async () => {
  await mongoose.connection.close()
})