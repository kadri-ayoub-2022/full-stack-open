const express = require('express')
const { getBlogs, createBlog } = require('../controller/blog')
const router = express.Router()

router.get('/', getBlogs)

router.post('/', createBlog)

module.exports = router