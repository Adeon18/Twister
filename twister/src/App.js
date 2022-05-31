import './App.css';
import './styles/styles.css'
import './styles/LoginForm.css'
import {useState} from 'react';
import LoginForm from './components/login/LoginForm';
import LoginInput from './components/login/LoginInput';
import TweetManager from './components/tweets/TweetManager';
import SearchManager from './components/search/SearchManager';
import {Routes} from "react-router";
import {Route} from "react-router";
import TweetField from "./components/tweets/TweetField";
import TweetPage from "./components/tweets/TweetPage";

function App() {
    const [currentUserData, setCurrentUserData] = useState({login: "", id: -1});

    const updateUserData = data => {
        setCurrentUserData(data);
    }

    return (
        <div className="App">
            {(currentUserData.id === -1) ? (
                <LoginForm updateCurrentUserData={updateUserData}/>
            ):
                <Routes>
                    <Route path={"/"} element={<TweetManager userData={currentUserData}/>}></Route>
                    <Route path={"/tweet/:id"} element={<TweetPage userData={currentUserData}/>}></Route>
                    <Route path={"/search"} element={<SearchManager userData={currentUserData}/>}></Route>
                    <Route path={"/search/:id"} element={<SearchManager userData={currentUserData}/>}></Route>
                </Routes>
            }
        </div>
    );
}

export default App;
