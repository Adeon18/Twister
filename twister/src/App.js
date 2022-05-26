import './App.css';
import TweetManager from './components/tweets/TweetManager';
import SearchManager from './components/search/SearchManager';
import './styles/styles.css'

function App() {
  return (
    <div className="App">
      <TweetManager />
      <SearchManager />
    </div>
  );
}

export default App;
