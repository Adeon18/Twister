const Tweet = ({ tweet, remove, dislike }) => {
    return <div>
        <span>{tweet.value}</span>
        <button onClick={() => remove()}>Delete</button>
        <button onClick={() => dislike()}>Dislike</button>
        <span>Dislikes: {tweet.dislikes}</span>
    </div >
}

export default Tweet;