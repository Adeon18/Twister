import {useLocation} from "react-router";
import Tweet from "./Tweet";
import {useEffect, useState} from "react";

const getTags = (value) => {
    let tags = [];
    let lastInd = 0;
    while (true) {
        let tagIndex = value.indexOf('#', lastInd);
        if (tagIndex < 0) {
            break;
        } else {
            // TODO: try to also handle tags of format #a#b#c not as a single tag
            let endTagIndex = value.indexOf(" ", tagIndex);
            if (endTagIndex < 0) endTagIndex = value.length;
            let tag = value.substring(tagIndex, endTagIndex);
            lastInd = endTagIndex - 1;
            tags.push(tag);
        }
    }
    return tags;
}

const removeTagsJson = (tag, tweetId) => {
    let tagTweets = [];
    let tagHash = hash(tag);
    fetch('http://localhost:3001/tags/'+tagHash).then(response => response.json()).then(tag => {
        tagTweets = tag["tweets"];
        console.log(tagTweets, tweetId);
        tagTweets = tagTweets.filter(id => id !== tweetId);
        console.log(tagTweets);
        fetch('http://localhost:3001/tags/' + tagHash, {
            method: "PATCH",
            body: JSON.stringify({tweets: tagTweets}),
            headers: {'content-type': 'application/json'}
        })
    });
}

const hash = (value) => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        let char = value.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

const TweetPage = () => {
    const [tweets, setTweets] = useState([]);
    const location = useLocation();
    const tweet = location.state;
    // const tweet = state.tweet;
    // let id = location.pathname.substring(7, location.pathname.length)
    // console.log(id)
    const onRemove = (id) => {
        fetch('http://localhost:3001/tweets/' + id,).then(response => response.json()).then(tweet => {
            let tags = getTags(tweet.value);
            tags.forEach(t =>{
                removeTagsJson(t, id);
            })
        })
        fetch('http://localhost:3001/tweets/' + id, {method: "DELETE"})
    }

    const onDislike = (id, dislikes) => {

        fetch('http://localhost:3001/tweets/' + id, {
            method: "PATCH",
            body: JSON.stringify({'dislikes': dislikes + 1}),
            headers: {'content-type': 'application/json'}
        });
    }

    const onLike = (id, likes) => {

        fetch('http://localhost:3001/tweets/' + id, {
            method: "PATCH",
            body: JSON.stringify({'likes': likes + 1}),
            headers: {'content-type': 'application/json'}
        });
    }
    return <div>
        <Tweet key={tweet.id} like={() => onLike(tweet.id, tweet.likes)}
               dislike={() => onDislike(tweet.id, tweet.dislikes)} remove={() => onRemove(tweet.id)}
               tweet={tweet}/>
    </div>
}

export default TweetPage