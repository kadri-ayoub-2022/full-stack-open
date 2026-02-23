import { createSlice } from "@reduxjs/toolkit"
import { getAll,createNew,update } from "../services/anecdotes"

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(a => a.id === id)
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1
      }
      return state.map(anecdote => anecdote.id !== id ? anecdote : changedAnecdote)
    },                    
    createAnecdote(state, action) {
      const content = action.payload
      state.push(content)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

const { createAnecdote, setAnecdotes,voteAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const appendVoteAnecdote = (id) => {
  return async dispatch => {
    const anecdote = await getAll().then(anecdotes => anecdotes.find(a => a.id === id))
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    await update(id, updatedAnecdote)
    dispatch(voteAnecdote(id))
  }
}


export default anecdoteSlice.reducer

