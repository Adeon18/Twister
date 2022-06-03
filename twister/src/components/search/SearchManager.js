import { useEffect, useState } from "react";
import SearchField from "./SearchField";
import { findTweet, findUser, getTags, removeTagsJson, sortTweets } from "../../functions/TagsHelper"
import Tweet from "../tweets/Tweet";
import { useLocation } from "react-router";
import HomeButton from "../HomeButton/HomeButton";

const findTag = (array, tag) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === parseInt(tag)) {
            return i
        }
    }
    return -1;
}


const SearchManager = ({ userData }) => {
    const [tagTweets, setTagTweets] = useState([]);
    const link = useLocation();
    const userId = userData.id;

    let tag = link.pathname.substring(8, link.pathname.length);
    let k = 0;

    let pressedLike = false;
    let pressedDislike = false;

    useEffect(() => {
        tag = link.pathname.substring(8, link.pathname.length);
        fetchSet(tag);
    }, [link]);


    const fetchSet = (tag) => {
        let t = [];
        let tagTweetsID = [];
        k++;
        if (k < 2) {
            fetch('http://localhost:3001/tags/').then(response => response.json()).then(tags => {
                let tagInd = findTag(tags, tag);
                if (tagInd >= 0) {
                    tagTweetsID = tags[tagInd]['tweets'];
                    console.log(tagTweetsID);
                    setTagTweets(() => []);
                    for (let i = 0; i < tagTweetsID.length; i++) {
                        fetch('http://localhost:3001/tweets/').then(response => response.json()).then(tweets => {
                            let tweetInd = findTweet(tweets, tagTweetsID[i]);
                            if (tweets[tweetInd] !== undefined) {
                                t.push(tweets[tweetInd]);
                                console.log("AAAa", t);
                                setTagTweets((prev_state) => (sortTweets([...prev_state, tweets[tweetInd]])));
                            }
                        })
                    }
                } else {
                    console.log("No results found");
                }
            })
        }
    }


    const onRemove = async (id, tag) => {
        await fetch('http://localhost:3001/tweets/' + id,).then(response => response.json()).then(tweet => {
            if (tweet.uid === userId) {
                let tags = getTags(tweet.value);
                tags.forEach(t => {
                    removeTagsJson(t, id);
                })
                fetch('http://localhost:3001/tweets/' + id, { method: "DELETE" })
            }
        })
        await fetchSet(tag);
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
                body: JSON.stringify({ 'dislikes': dislikes, 'disliked': disliked }),
                headers: { 'content-type': 'application/json' }
            });
            await fetchSet(tag);
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
                body: JSON.stringify({ 'likes': likes, 'liked': liked }),
                headers: { 'content-type': 'application/json' }
            })
            await fetchSet(tag);
            pressedLike = false;
        }
    }

    const mapTweets = () => {
        console.log(tagTweets);
        if (tagTweets.length > 0) {
            return tagTweets.map((tweet) => (
                <Tweet key={tweet.id} like={() => onLike(tweet.id, tweet.likes, tweet.liked)}
                    dislike={() => onDislike(tweet.id, tweet.dislikes, tweet.disliked)}
                    remove={() => onRemove(tweet.id, tag)}
                    tweet={tweet} userData={userData} />)
            )
        }
    }

    return <div>
        <HomeButton />
        <SearchField />
        {
            mapTweets()
        }
    </div>

}
export default SearchManager;
