import like_button from './img/like_button.png'
import dislike_button from './img/dislike_button.png'
import {Link} from "react-router-dom";

const Tweet = ({tweet, remove, dislike, like}) => {
    return <div className={"post"}>
        <div className={"header-info"}>
            <label> ID: {tweet.id}</label>
            <Link to={{pathname:`/tweet/${tweet.id}`}}>
                <p>{tweet.value}</p>
            </Link>
        </div>
        <div className={"bottom-section"}>
            <button onClick={() => remove()}>Delete</button>
            <button onClick={() => dislike()}><img src={dislike_button} alt={"Dislike"}></img></button>
            <button className={"like-button"} onClick={() => like()}><img src={like_button} alt={"Like"}></img></button>
            <p>Likes: {tweet.likes}</p>
            <p>Dislikes: {tweet.dislikes}</p>
        </div>
    </div>
}

export default Tweet;