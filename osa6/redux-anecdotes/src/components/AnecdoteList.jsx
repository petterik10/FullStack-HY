import { useDispatch, useSelector } from "react-redux";
import { updateAnecdote } from "../reducers/anecdoteReducer";
import {
  clearNotification,
  setNotification,
} from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const dispatch = useDispatch();

  const anecdotes = useSelector(({ filter, anecdotes }) => {
    if (filter === "") {
      return anecdotes;
    }
    return anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const findVotedAnecdote = (id) => {
    return anecdotes.find((anecdote) => anecdote.id === id);
  };

  const handelAnecdoteVote = (id) => {
    dispatch(updateAnecdote(id));
    const votedAnecdote = findVotedAnecdote(id);
    dispatch(
      setNotification({
        message: `You voted ${votedAnecdote.content}`,
        type: "info",
      })
    );
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handelAnecdoteVote(anecdote.id)}>
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
