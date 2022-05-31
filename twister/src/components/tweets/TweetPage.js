import {useLocation} from "react-router";
import Tweet from "./Tweet";
import {removeTagsJson} from "../../functions/TagsHelper";
import {useState, useEffect} from "react";
import SearchField from "../search/SearchField";
import HomeButton from "../HomeButton/HomeButton";

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


const TweetPage = () => {
    const [tweets, setTweets] = useState([]);

    const location = useLocation();

    useEffect(() => {
        setTweets(location.state);
    }, [location])


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
        <HomeButton/>
        <SearchField/>
        <Tweet key={tweets.id} like={() => onLike(tweets.id, tweets.likes)}
               dislike={() => onDislike(tweets.id, tweets.dislikes)} remove={() => onRemove(tweets.id)}
               tweet={tweets}/>
    </div>
}

export default TweetPage