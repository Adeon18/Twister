import {useState} from "react";

const TweetField = ({onTweetSend}) => {
    const [tweetText, setTweetText] = useState('');

    const sendTweet = () => {
        onTweetSend(tweetText);
        setTweetText('');
    }

    //TODO: make max len a constant
    return <div>
        <input maxLength={100} value={tweetText} onChange={(ev) => setTweetText(ev.target.value)}></input>
        <button onClick={e => sendTweet()}>Tweet</button>
    </div>
}

export default TweetField;