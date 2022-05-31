import {useEffect, useState} from "react";
import SearchField from "./SearchField";
import {findTweet, getTags, removeTagsJson} from "../../functions/TagsHelper"
import Tweet from "../tweets/Tweet";
import {useLocation} from "react-router";
import HomeButton from "../HomeButton/HomeButton";

const findTag = (array, tag) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === parseInt(tag)) {
            return i
        }
    }
    return -1;
}

const SearchManager = () => {
    const [tagTweets, setTagTweets] = useState([]);
    const link = useLocation();
    let k = 0;
    useEffect(() => {
        let t = [];
        let tagTweetsID = [];
        const tag = link.pathname.substring(8, link.pathname.length);
        fetch('http://localhost:3001/tags/').then(response => response.json()).then(tags => {
            let tagInd = findTag(tags, tag);
            k++;
            if (tagInd >= 0) {
                tagTweetsID = tags[tagInd]['tweets'];
                console.log(tagTweetsID);
                setTagTweets(() => []);
                if (k < 2) {
                    for (let i = 0; i < tagTweetsID.length; i++) {
                        fetch('http://localhost:3001/tweets/').then(response => response.json()).then(tweets => {
                            let tweetInd = findTweet(tweets, tagTweetsID[i]);
                            t.push(tweets[tweetInd]);
                            console.log("AAAa", t);
                            setTagTweets((prev_state) => ([...prev_state, tweets[tweetInd]]));
                        })
                    }
                }
            } else {
                console.log("No results found");
            }
        })
    }, [link]);


    const onRemove = (id) => {
        fetch('http://localhost:3001/tweets/' + id,).then(response => response.json()).then(tweet => {
            let tags = getTags(tweet.value);
            tags.forEach(t => {
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
    console.log(tagTweets);
    return <div>
        <HomeButton/>
        <SearchField/>
        {
            tagTweets.map((tweet) => (
                <Tweet key={tweet.id} like={() => onLike(tweet.id, tweet.likes)}
                       dislike={() => onDislike(tweet.id, tweet.dislikes)} remove={() => onRemove(tweet.id)}
                       tweet={tweet}/>)
            )
        }
    </div>

}
export default SearchManager;
