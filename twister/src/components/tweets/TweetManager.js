import {useEffect, useState} from "react";
import TweetField from "./TweetField";
import Tweet from "./Tweet";
import {useLocation} from "react-router";


// TODO: get all the scary functions as far away as possible
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

const findTag = (array, tag) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].tag === tag) {
            return i
        }
    }
    return -1;
}

const addTagsJson = (tag, tweetId) => {
    let tagTweets = [];
    let tagHash = hash(tag);
    fetch('http://localhost:3001/tags/').then(response => response.json()).then(tags => {
        let tagInd = findTag(tags, tag)
        if (tagInd < 0) {
            tagTweets = [tweetId];
            fetch('http://localhost:3001/tags', {
                method: "POST",
                body: JSON.stringify({tweets: tagTweets, id: tagHash, tag: tag}),
                headers: {'content-type': 'application/json'}
            })
        } else {
            tagTweets = tags[tagInd]["tweets"]
            tagTweets.push(tweetId);
            fetch('http://localhost:3001/tags/' + tagHash, {
                method: "PATCH",
                body: JSON.stringify({tweets: tagTweets}),
                headers: {'content-type': 'application/json'}
            })
        }
    });
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


const TweetManager = () => {
    const [tweets, setTweets] = useState([]);
    const location = useLocation();
    useEffect(() => {
        fetch('http://localhost:3001/tweets')
            .then(response => response.json())
            .then(tweets => setTweets(tweets))
    }, [])

    const onTweetSend = (value) => {
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
            tags.forEach(t =>{
                removeTagsJson(t, id);
            })
            setTweets((existingTweets) => existingTweets.filter(tweet => tweet.id !== id))
        })
        fetch('http://localhost:3001/tweets/' + id, {method: "DELETE"})
    }

    const onDislike = (id, dislikes) => {
        setTweets((existingTweets) => existingTweets.map(tweet => tweet.id === id ? ({
            ...tweet,
            dislikes: dislikes + 1
        }) : tweet))
        fetch('http://localhost:3001/tweets/' + id, {
            method: "PATCH",
            body: JSON.stringify({'dislikes': dislikes + 1}),
            headers: {'content-type': 'application/json'}
        });
    }

    const onLike = (id, likes) => {
        setTweets((existingTweets) => existingTweets.map(tweet => tweet.id === id ? ({
            ...tweet,
            likes: likes + 1
        }) : tweet))
        fetch('http://localhost:3001/tweets/' + id, {
            method: "PATCH",
            body: JSON.stringify({'likes': likes + 1}),
            headers: {'content-type': 'application/json'}
        });
    }

    return <div>
        <TweetField onTweetSend={onTweetSend}/>
        {
            tweets.map((tweet) => (
                <Tweet key={tweet.id} like={() => onLike(tweet.id, tweet.likes)}
                       dislike={() => onDislike(tweet.id, tweet.dislikes)} remove={() => onRemove(tweet.id)}
                       tweet={tweet}/>
            ))
        }
    </div>
}

export default TweetManager;