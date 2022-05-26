import {useState} from "react";
import SearchField from "./SearchField";
import {findTweet, getTags, removeTagsJson} from "../../TagsHelper"
import Tweet from "../tweets/Tweet";
import {useLocation} from "react-router";

const SearchManager = () => {
    const [tagTweets, setTagTweets] = useState([]);

    const findTag = (array, tag) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i].id === parseInt(tag)) {
                return i
            }
        }
        return -1;
    }

    const OnSearch = () => {
        let tagTweetsID = [];
        const link = useLocation();
        const tag = link.pathname.substring(8, link.pathname.length);
        console.log(tag)
        fetch('http://localhost:3001/tags/').then(response => response.json()).then(tags => {
            // console.log(tags)
            let tagInd = findTag(tags, tag);
            if (tagInd >= 0) {
                tagTweetsID = tags[tagInd]['tweets'];
                for (let i = 0; i < tagTweetsID.length; i++) {
                    fetch('http://localhost:3001/tweets/').then(response => response.json()).then(tweets => {
                        let tweetInd = findTweet(tweets, tagTweetsID[i]);
                        setTagTweets((prev_state) => ([...prev_state, tweets[tweetInd]]));
                    })
                }
            } else {
                console.log("No results found")
            }
        })
    }
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

    return <div>
        <SearchField OnSearch={OnSearch}/>
        {
            tagTweets.map((tweet) => (
                <Tweet key={tweet.id} like={() => onLike(tweet.id, tweet.likes)}
                       dislike={() => onDislike(tweet.id, tweet.dislikes)} remove={() => onRemove(tweet.id)}
                       tweet={tweet}/>)
            )
        }
        }
    </div>
}
export default SearchManager;
