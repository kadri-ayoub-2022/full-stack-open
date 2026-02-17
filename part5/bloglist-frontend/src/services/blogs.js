import axios from 'axios'

const getAll = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  const response = await axios.get('http://localhost:3001/api/blogs', config)
  return response.data
}

const create = async (newBlog, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }

  const response = await axios.post('http://localhost:3001/api/blogs', newBlog, config)
  return response.data
}


  const login = async (credentials) => {
    const response = await axios.post('http://localhost:3001/api/users/login', credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response.data
  }

  const put = async (id, updatedBlog, token) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.put(`http://localhost:3001/api/blogs/${id}`, updatedBlog, config)
    return response.data
  }

  const remove = async (id, token) => {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.delete(`http://localhost:3001/api/blogs/${id}`, config)
    return response.data
  }

  export default { getAll, login, create, put, remove }