const Tweet = ({ tweet, remove, dislike, like }) => {
    return <div>
        <span>{tweet.value}</span>
        <button onClick={() => remove()}>Delete</button>
        <button onClick={() => dislike()}>Dislike</button>
        <button onClick={() => like()}>Like</button>
        <span>Dislikes: {tweet.dislikes}</span>
        <span>  Likes: {tweet.likes}</span>
        <span>  ID: {tweet.id}</span>
    </div>
}

export default Tweet;