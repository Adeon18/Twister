import { useState } from "react";
import NewTweet from "./NewTweet";
import Tweet from "./tweet";

const Tweets = () => {
    const [tweets, setTweets] = useState([]);

    const onTweetInpSend = (value) => {
        setTweets((existingTweets) => [...existingTweets, { value, id: new Date().getTime(), dislikes: 0 }])
    }

    const onRemove = (id) => {
        setTweets((existingTweets) => existingTweets.filter(tweet => tweet.id !== id))
    }

    const onDislike = (id) => {
        setTweets((existingTweets) => {
            let element = existingTweets.filter(tweet => tweet.id === id)[0];
            element.dislikes += 1;
            existingTweets = existingTweets.filter(tweet => tweet.id !== id);
            existingTweets = [...existingTweets, element];
            return existingTweets;
        }
        )
    }

    return <div>
        <NewTweet onTweetInpSend={onTweetInpSend} />
        {
            tweets.map((tweet) => (
                <Tweet key={tweet.id} dislike={() => onDislike(tweet.id)} remove={() => onRemove(tweet.id)} tweet={tweet} />
            ))
        }
    </div>
}

export default Tweets;