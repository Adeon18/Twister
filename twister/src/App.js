import logo from './logo.svg';
import './App.css';
import LoginInputForm from './components/LoginInputForm';
import { useState } from 'react';

function App() {

  const [user, setUser] = useState({login: ""})
  const [error, setError] = useState("");

  const login = data => {
    console.log(data);

    if (data.login === "die" && data.password === "please") {
      console.log("Here should be login");
      setUser({login: data.login});
    } else {
      console.log("Here should be error");
      setError("Wrong Credentials!");
    }
  }

  return (
    <div className="App">
      <LoginInputForm login={login} error={error}/>
    </div>
  );
}

export default App;
