import {useEffect, useState} from "react";
import TweetField from "./TweetField";
import Tweet from "./Tweet";


import {addTagsJson, removeTagsJson, getTags} from "../../functions/TagsHelper"
import {useLocation} from "react-router";
import SearchField from "../search/SearchField";
import HomeButton from "../HomeButton/HomeButton";


const find_user = (array, id) => {
    for (let i = 0; i < array.length; i++) {
        console.log(array[i], i, id)
        if (array[i] === id) {
            return i;
        }
    }
    return -1;
}

const TweetManager = ({userData}) => {
    const [tweets, setTweets] = useState([]);
    const location = useLocation();
    const userId = userData.id;
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
        const newTweet = {value, id: id, likes: 0, dislikes: 0, liked: [], disliked: []};
        setTweets((existingTweets) => [...existingTweets, newTweet]);

        // extract hashtags
        let tags = getTags(value)
        // update hashtags json
        tags.forEach(tag => {
            addTagsJson(tag, id);
        })

        await fetch('http://localhost:3001/tweets', {
            method: "POST",
            body: JSON.stringify(newTweet),
            headers: {'content-type': 'application/json'}
        });
    }

    const onRemove = async (id) => {
        await fetch('http://localhost:3001/tweets/' + id,).then(response => response.json()).then(tweet => {
            let tags = getTags(tweet.value);
            tags.forEach(t => {
                removeTagsJson(t, id);
            })
            setTweets((existingTweets) => existingTweets.filter(tweet => tweet.id !== id))
        })
        await fetch('http://localhost:3001/tweets/' + id, {method: "DELETE"})
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

    const onLike = async (id, likes, liked) => {
        console.log(liked);
        let user_ind = find_user(liked, userId);
        console.log(user_ind);
        if (user_ind >= 0) {
            console.log("BBBBBB")
            liked = liked.filter(id => id !== userId);
            likes -= 1;
        }
        else{
            console.log("AAAAA")
            liked.push(userId);
            likes += 1;
        }
        await fetch('http://localhost:3001/tweets/' + id, {
            method: "PATCH",
            body: JSON.stringify({'likes': likes, 'liked': liked}),
            headers: {'content-type': 'application/json'}
        })
        await fetch('http://localhost:3001/tweets/').then(response => response.json()).then(tweets => {
            setTweets(tweets);
        })
    }

    const mapTweets = (tweets) => {
        return (tweets.map((tweet) => (
            <Tweet key={tweet.id} like={() => onLike(tweet.id, tweet.likes, tweet.liked)}
                   dislike={() => onDislike(tweet.id, tweet.dislikes, tweet.disliked)} remove={() => onRemove(tweet.id)}
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