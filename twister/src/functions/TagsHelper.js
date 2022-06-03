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

const findTweet = (array, tweet) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === tweet) {
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

const findUser = (array, id) => {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === id) {
            return i;
        }
    }
    return -1;
}

const sortTweets = (t) => {
    let sorted = t;
    sorted.sort((a, b) => (a.id < b.id) ? 1 : 0)
    return sorted;
}

export {hash, findTweet, findTag, addTagsJson, removeTagsJson, getTags, findUser, sortTweets}