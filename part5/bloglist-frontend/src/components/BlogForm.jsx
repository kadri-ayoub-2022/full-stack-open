import React from 'react'

const BlogForm = ({ handleSubmit }) => {
  return (
    <div>
      <form onSubmit={handleSubmit}>
          <div>
            title:
            <input type="text" name="Title" />
          </div>
          <div>
            author:
            <input type="text" name="Author" />
          </div>
          <div>
            url:
            <input type="text" name="Url" />
          </div>
          <button type="submit">create</button>
        </form>
    </div>
  )
}

export default BlogForm
