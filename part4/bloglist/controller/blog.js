const Blog = require('../models/Blog')
const bcrypt = require('bcryptjs')
const {getTokenFrom} = require('../utils/getTokenFrom')



const getBlogs = (request, response) => {
  const token = getTokenFrom(request)

  if (!token) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }



  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
}

const createBlog = (request, response) => {

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



    blog.save().then(result => {
    response.status(201).json(result)
  })
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

  Blog.findByIdAndUpdate(id, updatedBlog, { new: true })
    .then(result => {
      response.json(result)
    })
    .catch(error => {
      console.error('Error updating blog:', error)
      response.status(500).json({ error: 'An error occurred while updating the blog' })
    })
}

const deleteBlog = (request, response) => {
  const { id } = request.params

  const token = getTokenFrom(request)
  if (!token) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Token missing or invalid' })
  }
  if (decodedToken.id !== Blog.user.toString()) {
    return response.status(403).json({ error: 'Unauthorized to delete this blog' })
  }
  Blog.findByIdAndRemove(id)
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
