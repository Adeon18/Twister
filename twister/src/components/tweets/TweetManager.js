import {useEffect, useState} from "react";
import TweetField from "./TweetField";
import Tweet from "./Tweet";


import {addTagsJson, removeTagsJson, getTags, findUser} from "../../functions/TagsHelper"
import SearchField from "../search/SearchField";
import HomeButton from "../HomeButton/HomeButton";
import {useLocation} from "react-router";


const TweetManager = ({userData}) => {
    const [tweets, setTweets] = useState([]);
    const location = useLocation();
    const userId = userData.id;

    // KOSTYL
    let pressedLike = false;
    let pressedDislike = false;
    // END KOSTYL

    useEffect(() => {
        fetch('http://10.10.244.180:3001/tweets')
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
        const newTweet = {value, id: id, uid: userId, username: userData.login, likes: 0, dislikes: 0, liked: [], disliked: []};
        setTweets((existingTweets) => [...existingTweets, newTweet]);

        // extract hashtags
        let tags = getTags(value)
        // update hashtags json
        tags.forEach(tag => {
            addTagsJson(tag, id);
        })

        await fetch('http://10.10.244.180:3001/tweets', {
            method: "POST",
            body: JSON.stringify(newTweet),
            headers: {'content-type': 'application/json'}
        });
    }

    const onRemove = async (id) => {

        await fetch('http://10.10.244.180:3001/tweets/' + id,).then(response => response.json()).then(tweet => {
            if (tweet.uid === userId) {
                let tags = getTags(tweet.value);
                tags.forEach(t => {
                    removeTagsJson(t, id);
                })
                setTweets((existingTweets) => existingTweets.filter(tweet => tweet.id !== id))
                fetch('http://10.10.244.180:3001/tweets/' + id, {method: "DELETE"})
            }
        })
    }

    const onDislike = async (id, dislikes, disliked) => {
        let user_ind = findUser(disliked, userId);
        if (!pressedDislike) {
            if (user_ind >= 0) {
                disliked = disliked.filter(id => id !== userId);
                dislikes -= 1;
            } else {
                disliked.push(userId);
                dislikes += 1;
            }
            pressedDislike = true;
            await fetch('http://10.10.244.180:3001/tweets/' + id, {
                method: "PATCH",
                body: JSON.stringify({'dislikes': dislikes, 'disliked': disliked}),
                headers: {'content-type': 'application/json'}
            });
            await fetch('http://10.10.244.180:3001/tweets/').then(response => response.json()).then(tweets => {
                setTweets(tweets);
            })
            pressedDislike = false;
        }
    }

    const onLike = async (id, likes, liked) => {
        let user_ind = findUser(liked, userId);
        if (!pressedLike) {
            if (user_ind >= 0) {
                liked = liked.filter(id => id !== userId);
                likes -= 1;
            } else {
                liked.push(userId);
                likes += 1;
            }
            pressedLike = true
            await fetch('http://10.10.244.180:3001/tweets/' + id, {
                method: "PATCH",
                body: JSON.stringify({'likes': likes, 'liked': liked}),
                headers: {'content-type': 'application/json'}
            })
            await fetch('http://10.10.244.180:3001/tweets/').then(response => response.json()).then(tweets => {
                setTweets(tweets);
            })
            pressedLike = false;
        }
    }

    const mapTweets = (tweets) => {
        return (tweets.map((tweet) => (
            <Tweet key={tweet.id} like={() => onLike(tweet.id, tweet.likes, tweet.liked)}
                   dislike={() => onDislike(tweet.id, tweet.dislikes, tweet.disliked)} remove={() => onRemove(tweet.id)}
                   tweet={tweet} userData={userData}/>)
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