import { useState } from "react";
import TweetField from "./TweetField";
import Tweet from "./Tweet";

const TweetManager = () => {
    const [tweets, setTweets] = useState([]);

    const onTweetInpSend = (value) => {
        setTweets((existingTweets) => [...existingTweets, { value, id: new Date().getTime(), likes: 0, dislikes: 0 }])
    }

    const onRemove = (id) => {
        setTweets((existingTweets) => existingTweets.filter(tweet => tweet.id !== id))
    }

    const onDislike = (id, dislikes) => {
        setTweets((existingTweets) => existingTweets.map(tweet => tweet.id === id ?({...tweet, dislikes: dislikes + 1}): tweet))
    }

    const onLike = (id, likes) => {
        setTweets((existingTweets) => existingTweets.map(tweet => tweet.id === id ?({...tweet, likes: likes + 1}): tweet))
    }

    return <div>
        <TweetField onTweetInpSend={onTweetInpSend} />
        {
            tweets.map((tweet) => (
                <Tweet key={tweet.id} like={() => onLike(tweet.id, tweet.likes)} dislike={() => onDislike(tweet.id, tweet.dislikes)} remove={() => onRemove(tweet.id)} tweet={tweet} />
            ))
        }
    </div>
}

export default TweetManager;