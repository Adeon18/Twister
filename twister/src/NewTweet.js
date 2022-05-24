import { useState } from "react";

const NewTweet = ({ onTweetInpSend }) => {
    const [tweetText, setTweetText] = useState('');

    const sendTweet = () => {
        onTweetInpSend(tweetText);
        setTweetText('');
    }


    return <div>
        <input value={tweetText} onChange={(ev) => setTweetText(ev.target.value)}></input>
        <button onClick={e => sendTweet()}>Tweet</button>
    </div>
}

export default NewTweet;