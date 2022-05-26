const Search = ({ search}) => {
    return <div>
        <span>{search.value}</span>
        <button onClick={() => search()}>Search</button>
    </div>
}

export default Search;