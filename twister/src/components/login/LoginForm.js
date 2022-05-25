import { useEffect, useState } from "react"
import LoginInput from "./LoginInput"
import CryptoJS from "crypto-js"

const LoginForm = () => {

    let SHA256 = require("crypto-js/sha256");

    const [userData, setUserData] = useState([])
    const [user, setUser] = useState({ login: "" })
    const [error, setError] = useState("");

    useEffect(() => {
        console.log("made request..");
        fetch("http://localhost:3001/users").then(userData => userData.json()).then(userData => {
            setUserData(userData);
        });
    }, [])

    const areCredentialsValid = data => {
        for (const entry of userData) {
            if (entry.login === data.login) {
                if (JSON.stringify(SHA256(data.password).words) === entry.password) {
                    return true;
                }
            }
        }
        return false;
    }

    const canRegister = data => {
        for (const entry of userData) {
            if (entry.login === data.login) {
                return false
            }
        }
        return true;
    }

    const onLoginHandler = data => {
        if (areCredentialsValid(data)) {
            console.log("Here should be login code.");
            setError("");
        } else {
            setError("Wrong Credentials!");
        }
    }

    const onRegisterHandler = data => {
        if (canRegister(data)) {
            const singleEntry = { "login": data.login, "password": JSON.stringify(SHA256(data.password).words), "tweets": [] };
            setUserData(userData => ([...userData, singleEntry]));
            setError("");
            // Fetch data
            fetch("http://localhost:3001/users", { method: "POST", body: JSON.stringify(singleEntry), headers: { "content-type": "application/json" } });
        } else {
            setError("Login already taken!");
        }
    }

    return (
        <div className="login-form">
            <LoginInput Login={onLoginHandler} Register={onRegisterHandler} error={error} />
        </div>
    );
}

export default LoginForm;