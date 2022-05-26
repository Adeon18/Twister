import './App.css';
import './styles/styles.css'
import './styles/LoginForm.css'
import { useState } from 'react';
import LoginForm from './components/login/LoginForm';
import LoginInput from './components/login/LoginInput';
import TweetManager from './components/tweets/TweetManager';
import SearchManager from './components/search/SearchManager';

function App() {
  return (
    <div className="App">
      <SearchManager/>
    </div>
  );
}

export default App;
