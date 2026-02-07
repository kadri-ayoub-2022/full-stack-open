import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { appendVoteAnecdote,initializeAnecdotes } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(
        (state) => {
            const filter = state.filter.toLowerCase();
            return state.anecdotes.filter((anecdote) =>
                anecdote.content.toLowerCase().includes(filter)
            );
        }
    )
    
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeAnecdotes())
    }, [dispatch]);

    const vote = (id) => {
        dispatch(appendVoteAnecdote(id))
    }

    return (
        <div>
        {[...anecdotes]
            .sort((a, b) => b.votes - a.votes)
            .map((anecdote) => (
            <SingleAnecdote key={anecdote.id} anecdote={anecdote} handleVote={() => vote(anecdote.id)} />
            ))}
        </div>
    );
}


const SingleAnecdote = ({ anecdote, handleVote }) => {
    return (
        <div>
            <div>{anecdote.content}</div>   
            <div>
                has {anecdote.votes}
                <button onClick={handleVote}>vote</button>
            </div>
        </div>
    )
}

export default AnecdoteList
