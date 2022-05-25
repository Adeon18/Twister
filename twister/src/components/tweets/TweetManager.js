import {useEffect, useState} from "react";
import TweetField from "./TweetField";
import Tweet from "./Tweet";

const TweetManager = () => {
    const [tweets, setTweets] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/tweets')
            .then(response => response.json())
            .then(tweets => setTweets(tweets))
    }, [])

    const onTweetInpSend = (value) => {
        const newTweet = { value, id: new Date().getTime(), likes: 0, dislikes: 0 };
        setTweets((existingTweets) => [...existingTweets, newTweet]);
        fetch('http://localhost:3001/tweets', {method: "POST", body: JSON.stringify(newTweet), headers:{'content-type': 'application/json'}});
    }

    const onRemove = (id) => {
        setTweets((existingTweets) => existingTweets.filter(tweet => tweet.id !== id))
        fetch('http://localhost:3001/tweets/' + id, {method: "DELETE"})
    }

    const onDislike = (id, dislikes) => {
        setTweets((existingTweets) => existingTweets.map(tweet => tweet.id === id ?({...tweet, dislikes: dislikes + 1}): tweet))
        fetch('http://localhost:3001/tweets/' + id, {method: "PATCH", body: JSON.stringify({'dislikes': dislikes+1}), headers:{'content-type': 'application/json'}});

    }

    const onLike = (id, likes) => {
        setTweets((existingTweets) => existingTweets.map(tweet => tweet.id === id ?({...tweet, likes: likes + 1}): tweet))
        fetch('http://localhost:3001/tweets/' + id, {method: "PATCH", body: JSON.stringify({'likes': likes+1}), headers:{'content-type': 'application/json'}});
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