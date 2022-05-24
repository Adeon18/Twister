import { useState } from "react"

const LoginInputForm = ({ login, register, error}) => {

    const [data, setData] = useState({login: "", password: ""});

    const submitLoginHandler = ev => {
        ev.preventDefault();

        if (ev.nativeEvent.submitter.name === "login") {
            login(data);
        } else if (ev.nativeEvent.submitter.name === "register"){
            register(data);
        }
    }

    return (
        <form onSubmit={submitLoginHandler}>
            <div className="inner-form">
                <h2>Login</h2>
                
                {(error != "") ? (<div className="error">{error}</div>): ""}

                <div className="form-input">
                    <label htmlFor="login">Login:</label>
                    <input type="text" name="login" id="login" onChange={ev => setData({...data, login: ev.target.value})} value={data.login}/>
                </div>

                <div className="form-input">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" onChange={ev => setData({...data, password: ev.target.value})} value={data.password}/>
                </div>
                <input type="submit" name="login" value="Log In"></input>
                <input type="submit" name="register" value="Register"></input>
            </div>
        </form>
    )
}

export default LoginInputForm;