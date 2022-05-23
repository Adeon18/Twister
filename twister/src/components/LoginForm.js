import { useEffect, useState } from "react"
import LoginInput from "./LoginInput"

const LoginForm = () => {
    const [userData, setUserData] = useState([])
    const [user, setUser] = useState({login: ""})
    const [error, setError] = useState("");

    useEffect( () => {
        console.log("made request..");
        fetch("api/users").then( userData => userData.json() ).then(userData => {
            setUserData(userData);
        });
    }, [])

    const onLoginHandler = data => {
        console.log(data);

        if (data.login === "die" && data.password === "please") {
            console.log("Here should be login");
            setUser({login: data.login});
        } else {
            const singleEntry = {"login": data.login, "password": data.password, "tweets": []};
            setUserData(userData => ([...userData, singleEntry]));
            fetch("api/users", {method: "POST", body: JSON.stringify(singleEntry), headers: {"content-type": "application/json"}});
        }
    }

    return (
        <div className="login-form">
            <LoginInput login={onLoginHandler} error={error}/>
        </div>
    );
}

export default LoginForm;