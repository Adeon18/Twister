import {useEffect, useState} from "react";
import TweetField from "./TweetField";
import Tweet from "./Tweet";


import {addTagsJson, removeTagsJson, getTags, findTweet} from "../../functions/TagsHelper"
import {useLocation} from "react-router";
import SearchField from "../search/SearchField";
import HomeButton from "../HomeButton/HomeButton";


const TweetManager = () => {
    const [tweets, setTweets] = useState([]);
    const location = useLocation();
    useEffect(() => {
        fetch('http://localhost:3001/tweets')
            .then(response => response.json())
            .then(tweets => setTweets(tweets))
    }, [])

    const onTweetSend = async (value) => {
        console.log(location);
        // dont tweet to small tweets (and empty tweets)
        if (value.length < 2) {
            return
        }
        let id = new Date().getTime();
        const newTweet = {value, id: id, likes: 0, dislikes: 0};
        setTweets((existingTweets) => [...existingTweets, newTweet]);

        // extract hashtags
        let tags = getTags(value)
        // update hashtags json
        tags.forEach(tag => {
            addTagsJson(tag, id);
        })

        fetch('http://localhost:3001/tweets', {
            method: "POST",
            body: JSON.stringify(newTweet),
            headers: {'content-type': 'application/json'}
        });
    }

    const onRemove = (id) => {
        fetch('http://localhost:3001/tweets/' + id,).then(response => response.json()).then(tweet => {
            let tags = getTags(tweet.value);
            tags.forEach(t => {
                removeTagsJson(t, id);
            })
            setTweets((existingTweets) => existingTweets.filter(tweet => tweet.id !== id))
        })
        fetch('http://localhost:3001/tweets/' + id, {method: "DELETE"})
    }

    const onDislike = async (id, dislikes) => {
        await fetch('http://localhost:3001/tweets/' + id, {
            method: "PATCH",
            body: JSON.stringify({'dislikes': dislikes + 1}),
            headers: {'content-type': 'application/json'}
        });
        await fetch('http://localhost:3001/tweets/').then(response => response.json()).then(tweets => {
            setTweets(tweets);
        })
    }

    const onLike = async (id, likes) => {
        await fetch('http://localhost:3001/tweets/' + id, {
            method: "PATCH",
            body: JSON.stringify({'likes': likes + 1}),
            headers: {'content-type': 'application/json'}
        })
        await fetch('http://localhost:3001/tweets/').then(response => response.json()).then(tweets => {
            setTweets(tweets);
        })
    }

    const mapTweets = (tweets) => {
        return (tweets.map((tweet) => (
            <Tweet key={tweet.id} like={() => onLike(tweet.id, tweet.likes)}
                   dislike={() => onDislike(tweet.id, tweet.dislikes)} remove={() => onRemove(tweet.id)}
                   tweet={tweet}/>)
        ))
    }

    return <div>
        <HomeButton/>
        <TweetField onTweetSend={onTweetSend}/>
        <SearchField/>
        {
            mapTweets(tweets)
        }
    </div>
}

export default TweetManager;