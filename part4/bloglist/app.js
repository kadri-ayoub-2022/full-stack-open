const express = require('express')
const usersRouter = require('./routes/user')
const blogsRouter = require('./routes/blog')
const cors = require('cors')
const Blog = require('./models/Blog')





const app = express()

app.use(express.json())
app.use(cors())
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

app.get('/api/test', (request, response) => {
    response.json({ message: 'API is working!' })
})


module.exports = app
