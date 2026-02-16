const mongoose = require('mongoose')
const supertest = require('supertest')
const { test, beforeEach, after, expect } = require('node:test')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany([
    {
      title: 'First blog',
      author: 'Ayoub',
      url: 'http://example1.com',
      likes: 5
    },
    {
      title: 'Second blog',
      author: 'John',
      url: 'http://example2.com',
      likes: 3
    }
  ])
})

test('blogs are returned as json and correct amount', async () => {
    await Blog.deleteMany({})
  const newBlog1 = {
    title: 'First blog',
    author: 'Ayoub',
    url: 'http://example1.com',
    likes: 5
  }

  const newBlog2 = {
    title: 'Second blog',
    author: 'John',
    url: 'http://example2.com',
    likes: 3
  }

  await api.post('/api/blogs').send(newBlog1)
  await api.post('/api/blogs').send(newBlog2)

  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(2)
})

test('unique identifier property of blog posts is named id', async () => {
    await Blog.deleteMany({})
  const newBlog = {
    title: 'New blog',
    author: 'Jane Doe',
    url: 'http://example3.com',
    likes: 7
  }
  const response = await api.get('/api/blogs')

  const blog = response.body[0]

  expect(blog.id).toBeDefined()
  expect(blog._id).not.toBeDefined()
})

test('a valid blog can be added', async () => {
    await Blog.deleteMany({})
  const newBlog = {
    title: 'New blog',
    author: 'Jane Doe',
    url: 'http://example3.com',
    likes: 7
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(3)
})

test('if likes property is missing, it defaults to 0', async () => {
    await Blog.deleteMany({})
  const newBlog = {
    title: 'New blog',
    author: 'Jane Doe',
    url: 'http://example3.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body[2].likes).toBe(0)
})

test('blog without title and url is not added', async () => {
    await Blog.deleteMany({})
  const newBlog = {
    author: 'Jane Doe',
    url: 'http://example3.com',
    likes: 7
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(2)
})


after(async () => {
  await mongoose.connection.close()
})
