import { useState } from "react"

const LoginInputForm = ({ login, error}) => {

    const [data, setData] = useState({login: "", password: ""});

    const submitHandler = ev => {
        ev.preventDefault();

        login(data);
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="inner-form">
                <h2>Login</h2>
                
                {(error != "") ? (<div className="error">{error}</div>): ""}

                <div className="form-input">
                    <label htmlFor="login">Login:</label>
                    <input type="text" name="login" id="login" onChange={ev => setData({...data, login: ev.target.value})} value={data.login}/>
                </div>

                <div className="form-input">
                    <label htmlFor="password">Password:</label>
                    <input type="text" name="password" id="password" onChange={ev => setData({...data, password: ev.target.value})} value={data.password}/>
                </div>
                <input type="submit" value="Log In"></input>
            </div>
        </form>
    )
}

export default LoginInputForm;