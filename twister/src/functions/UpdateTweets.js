// import {removeTagsJson} from "./TagsHelper";
//
// const onRemove = (id) => {
//     fetch('http://localhost:3001/tweets/' + id,).then(response => response.json()).then(tweet => {
//         let tags = getTags(tweet.value);
//         tags.forEach(t => {
//             removeTagsJson(t, id);
//         })
//     })
//     fetch('http://localhost:3001/tweets/' + id, {method: "DELETE"})
// }
//
// const onDislike = (id, dislikes) => {
//
//     fetch('http://localhost:3001/tweets/' + id, {
//         method: "PATCH",
//         body: JSON.stringify({'dislikes': dislikes + 1}),
//         headers: {'content-type': 'application/json'}
//     });
// }
//
// const onLike = (id, likes) => {
//
//     fetch('http://localhost:3001/tweets/' + id, {
//         method: "PATCH",
//         body: JSON.stringify({'likes': likes + 1}),
//         headers: {'content-type': 'application/json'}
//     });
// }
//
// export {onRemove, onLike, onDislike}