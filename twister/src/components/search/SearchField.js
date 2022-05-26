import { useState } from "react";

const SearchField = ({ onSearchInpSend }) => {
    const [searchText, setSearchText] = useState('');

    const search = () => {
        onSearchInpSend(searchText);
        setSearchText('');
    }


    return <div>
        <input value={searchText} onChange={(ev) => setSearchText(ev.target.value)}></input>
        <button onClick={e => search()}>search</button>
    </div>
}

export default SearchField;