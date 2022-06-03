import {useLocation} from "react-router";
import Tweet from "./Tweet";
import {findUser, removeTagsJson, sortTweets} from "../../functions/TagsHelper";
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


const TweetPage = ({userData}) => {
    const [tweets, setTweets] = useState([]);
    const userId = userData.id;
    const location = useLocation();

    let pressedLike = false;
    let pressedDislike = false;

    useEffect(() => {
        let id = location.pathname.substring(7, location.pathname.length);
        fetch('http://localhost:3001/tweets/' + id).then(response => response.json()).then(tweet => setTweets(tweet))
    }, [location])

    const onRemove = async (id) => {
        await fetch('http://localhost:3001/tweets/' + id,).then(response => response.json()).then(tweet => {
            if (tweet.uid === userId) {
                let tags = getTags(tweet.value);
                tags.forEach(t => {
                    removeTagsJson(t, id);
                })
                setTweets((existingTweets) => existingTweets.filter(tweet => tweet.id !== id))
                fetch('http://localhost:3001/tweets/' + id, {method: "DELETE"})
            }
        })
    }

    const onDislike = async (id, dislikes, disliked) => {
        if (!pressedDislike) {
            let user_ind = findUser(disliked, userId);
            if (user_ind >= 0) {
                disliked = disliked.filter(id => id !== userId);
                dislikes -= 1;
            } else {
                disliked.push(userId);
                dislikes += 1;
            }
            pressedDislike = true;
            await fetch('http://localhost:3001/tweets/' + id, {
                method: "PATCH",
                body: JSON.stringify({'dislikes': dislikes, 'disliked': disliked}),
                headers: {'content-type': 'application/json'}
            });
            await fetch('http://localhost:3001/tweets/' + id).then(response => response.json()).then(tweet => setTweets(sortTweets(tweet)))
            pressedDislike = false;
        }
    }

    const onLike = async (id, likes, liked) => {
        if (!pressedLike) {
            let user_ind = findUser(liked, userId);
            if (user_ind >= 0) {
                liked = liked.filter(id => id !== userId);
                likes -= 1;
            } else {
                liked.push(userId);
                likes += 1;
            }
            pressedLike = true;
            await fetch('http://localhost:3001/tweets/' + id, {
                method: "PATCH",
                body: JSON.stringify({'likes': likes, 'liked': liked}),
                headers: {'content-type': 'application/json'}
            })

            await fetch('http://localhost:3001/tweets/' + id).then(response => response.json()).then(tweet => setTweets(sortTweets(tweet)))
            pressedLike = false;
        }
    }


    return <div>
        <HomeButton/>
        <SearchField/>
        <Tweet key={tweets.id} like={() => onLike(tweets.id, tweets.likes, tweets.liked)}
               dislike={() => onDislike(tweets.id, tweets.dislikes, tweets.disliked)} remove={() => onRemove(tweets.id)}
               tweet={tweets} userData={userData}/>
    </div>
}

export default TweetPage