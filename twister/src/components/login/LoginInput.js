import { useState } from "react"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

const LoginInputForm = ({ Login, Register, error }) => {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const submitLoginHandler = ev => {
        ev.preventDefault();
        Login({ login: login, password: password });
    }


    const submitRegisterHandler = ev => {
        ev.preventDefault();
        Register({ login: login, password: password, id: Math.round(new Date().getTime() / 1000) });
    }

    return (
        <form onSubmit={submitLoginHandler}>
            <div className="inner-form">
                <h2>Login</h2>

                {(error !== "") ? (<div className="error">{error}</div>) : ""}

                <div className="form-input">
                    <label htmlFor="login">Login:</label>
                    <input type="text" name="login" id="login" onChange={ev => setLogin(ev.target.value)} value={login}
                        maxLength="30" />
                </div>

                <div className="form-input">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" onChange={ev => setPassword(ev.target.value)}
                        value={password} maxLength="30" />
                </div>
                <input type="submit" name="login" value="Log In"></input>
                <button onClick={submitRegisterHandler} name="register">Register</button>
            </div>
        </form>
    )
}

export default LoginInputForm;