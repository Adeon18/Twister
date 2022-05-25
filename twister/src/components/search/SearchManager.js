import { useState } from "react";
import SearchField from "./SearchField";
import Search from "./Search";


const SearchManager = () => {
    const [searchText, setSearchText] = useState('');

    const onSearchInpSend = (value) => {
        setSearchText(() => value);
    }

    return <div>
        <SearchField onSearchInpSend={onSearchInpSend} />
        {
            searchText
        }
    </div>
}
export default SearchManager;
