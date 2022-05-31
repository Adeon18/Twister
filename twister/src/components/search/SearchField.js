import { useState } from "react";
import { Link } from "react-router-dom";
import { hash } from "../../functions/TagsHelper";

const SearchField = ({ }) => {
    const [searchTag, setSearchText] = useState('');


    return <div className={"search-box"}>
        <input value={searchTag} onChange={(ev) => setSearchText(ev.target.value)}></input>
        <Link to={'/search/' + hash(searchTag)}>
            <button> search</button>
        </Link>
    </div>
}

export default SearchField;