import like_button from './img/like_button.png'
import dislike_button from './img/dislike_button.png'
import { Link } from "react-router-dom";

const Tweet = ({ tweet, remove, dislike, like, userData }) => {
    return <div className={"post"}>
        <div className={"header-info"}>
            <label> user: {tweet.username}</label>
            <Link style={{ textDecoration: 'none' }} to={`/tweet/${tweet.id}`} state={tweet}>
                <p>{tweet.value}</p>
            </Link>
        </div>
        <div className={"bottom-section"}>
            {(userData.id === tweet.uid) ? (<button className={"del-button"} onClick={() => remove()}>Delete</button>) : ""}
            <button onClick={() => dislike()}><img src={dislike_button} alt={"Dislike"}></img></button>
            <button className={"like-button"} onClick={() => like()}><img src={like_button} alt={"Like"}></img></button>
            <p>Dislikes: {tweet.dislikes}</p>
            <p>Likes: {tweet.likes}</p>
        </div>
    </div>
}

export default Tweet;