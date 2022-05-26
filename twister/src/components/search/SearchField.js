import { useState } from "react";
import {Link} from "react-router-dom";
import {hash} from "../../TagsHelper";

const SearchField = ({ onSearch }) => {
    const [searchTag, setSearchText] = useState('');

    const search = () => {
        onSearch(searchTag);
        setSearchText('');
    }


    return <div className={".search-box"}>
        <input value={searchTag} onChange={(ev) => setSearchText(ev.target.value)}></input>
        <Link to={'/search/' + hash(searchTag)}>
            <button>search</button>
        </Link>
    </div>
}

export default SearchField;