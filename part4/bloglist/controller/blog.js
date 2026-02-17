const Blog = require('../models/Blog')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.header('Authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
}

const getBlogs = async (request, response) => {
  const token = getTokenFrom(request)

  if (!token) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  let decodedToken

  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
  } catch (error) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  const blogs = await Blog.find({ user: decodedToken.id })

  response.json(blogs)
}


const createBlog = async (request, response) => {

  const { title, author, url, likes } = request.body

  const token = getTokenFrom(request)

  if (!token) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: decodedToken.id
  })



    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)

}

const updateBlog = (request, response) => {
  const { id } = request.params
  const updatedBlog = request.body

  const token = getTokenFrom(request)

  if (!token) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  Blog.findByIdAndUpdate(id, updatedBlog, {
    returnDocument: 'after',
    runValidators: true,
    context: 'query'
  })
    .then(result => {
      response.json(result)
    })
    .catch(error => {
      console.error('Error updating blog:', error)
      response.status(500).json({ error: 'An error occurred while updating the blog' })
    })
}

const deleteBlog = async (request, response) => {
  const { id } = request.params

  const token = getTokenFrom(request)
  if (!token) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }
  const blog = await Blog.findById(id)
  console.log('Blog to delete:', blog)
  if (decodedToken.id !== blog.user.toString()) {
    return response.status(403).json({ error: 'Unauthorized to delete this blog' })
  }
  Blog.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      console.error('Error deleting blog:', error)
      response.status(500).json({ error: 'An error occurred while deleting the blog' })
    })
}

module.exports = {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog
}
