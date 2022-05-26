import './App.css';
import './styles/styles.css'
import './styles/LoginForm.css'
import { useState } from 'react';
import LoginForm from './components/login/LoginForm';
import LoginInput from './components/login/LoginInput';
import TweetManager from './components/tweets/TweetManager';
import SearchManager from './components/search/SearchManager';

function App() {

  const [currentUserData, setCurrentUserData] = useState({ login: "", id: -1});

  const updateUserData = data => {
    setCurrentUserData(data);
  }

  return (
    <div className="App">
      <LoginForm updateCurrentUserData={updateUserData}/>
    </div>
  );
}

export default App;
