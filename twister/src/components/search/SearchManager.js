import { useState } from "react";
import SearchField from "./SearchField";
import {findTag, findTweet, hash} from "../../TagsHelper"
import mapTweets from "../tweets/TweetManager"
import {useNavigate} from "react-router";

const SearchManager = () => {
    const [tagTweets, setTagTweets] = useState([]);
    const OnSearch = (tag) => {
        let tagTweetsID = [];
        fetch('http://localhost:3001/tags/').then(response => response.json()).then(tags => {
            let tagInd = findTag(tags, tag);
            if (tagInd >= 0) {
                tagTweetsID = tags[tagInd]['tweets'];
                for (let i=0; i<tagTweetsID.length; i++){
                    fetch('http://localhost:3001/tweets/').then(response => response.json()).then(tweets => {
                        let tweetInd = findTweet(tweets, tagTweetsID[i]);
                        console.log(tweets[tweetInd]);
                        setTagTweets((prev_state) => ([...prev_state, tweets[tweetInd]]));
                    })
                }
                console.log(tagTweets);
            }else{
                console.log("No results found")
            }
        })
    }

    return <div>
        <SearchField onSearch={OnSearch} />

    </div>
}
export default SearchManager;
