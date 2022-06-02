import { useEffect, useState } from "react"
import LoginInput from "./LoginInput"
import { useNavigate } from "react-router";


const LoginForm = ({ updateCurrentUserData }) => {

    let SHA256 = require("crypto-js/sha256");

    const [userData, setUserData] = useState([])
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const MIN_LOGIN_LENGTH = 3;
    const MIN_PASSWORD_LENGTH = 6;

    useEffect(() => {
        console.log("made request..");
        fetch("http://localhost:3001/users").then(userData => userData.json()).then(userData => {
            setUserData(userData);
        });
    }, [])

    // Check for correctness of credentials and set them.
    const checkAndSetCredentials = data => {
        for (const entry of userData) {
            if (entry.login === data.login) {
                if (JSON.stringify(SHA256(data.password).words) === entry.password) {
                    updateCurrentUserData({ login: entry.login, id: entry.id });
                    return true;
                }
            }
        }
        return false;
    }

    const canRegister = data => {
        if (!areInputsValid(data)) {
            return false;
        }

        for (const entry of userData) {
            if (entry.login === data.login) {
                setError("Login already taken!");
                return false;
            }
        }
        return true;
    }

    // Set the errors if bad input and return false
    const areInputsValid = data => {
        if (data.login.length < MIN_LOGIN_LENGTH) {
            setError("Login too short - needs more than " + MIN_LOGIN_LENGTH + " characters.");
            return false;
        } else {
            if (data.password.length < MIN_PASSWORD_LENGTH) {
                setError("Password too short - needs more than " + MIN_PASSWORD_LENGTH + " characters.");
                return false;
            }
        }
        return true;
    }

    const onLoginHandler = data => {
        if (checkAndSetCredentials(data)) {
            setError("");
            navigate("/");
        } else {
            setError("Wrong Credentials!");
        }
    }

    const onRegisterHandler = data => {
        if (canRegister(data)) {
            setError("");
            const singleEntry = { "login": data.login, "password": JSON.stringify(SHA256(data.password).words), id: data.id};
            setUserData(userData => ([...userData, singleEntry]));
            // Fetch data
            fetch("http://localhost:3001/users", { method: "POST", body: JSON.stringify(singleEntry), headers: { "content-type": "application/json" } });
        }
    }

    return (
        <div className="login-form">
            <LoginInput Login={onLoginHandler} Register={onRegisterHandler} error={error} />
        </div>
    );
}

export default LoginForm; 