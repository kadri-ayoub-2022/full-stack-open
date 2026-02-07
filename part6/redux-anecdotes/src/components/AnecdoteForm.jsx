import React from 'react'
import { useDispatch } from 'react-redux'
import { appendAnecdote } from '../reducers/anecdoteReducer'
import {printNotification} from '../reducers/notificationReducer'


const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const handleCreate = (event) => {
    event.preventDefault()
    const content = event.target[0].value
    event.target[0].value = ''

    dispatch(appendAnecdote(content))
    dispatch(printNotification(`you created '${content}'`))
  }

  return (
    <div>
        <h2>create new</h2>
        <form onSubmit={handleCreate}>
          <div>
            <input />
          </div>
          <button>create</button>
        </form>
    </div>
  )
}

export default AnecdoteForm
