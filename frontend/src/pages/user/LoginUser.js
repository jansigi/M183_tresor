import {useNavigate} from 'react-router-dom';
import {loginUser} from "../../comunication/LoginUserCall";
import React, {useState} from "react";
import "../../css/Styles.css";

/**
 * LoginUser
 * @author Peter Rutschmann
 */
function LoginUser({loginValues, setLoginValues}) {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await loginUser(loginValues.email, loginValues.password);
            console.log(user)
            navigate('/');
        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={loginValues.email}
                            onChange={(e) =>
                                setLoginValues(prevValues => ({...prevValues, email: e.target.value}))}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={loginValues.password}
                            onChange={(e) =>
                                setLoginValues(prevValues => ({...prevValues, password: e.target.value}))}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                </div>
                <button type="submit">Login</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
    );
}

export default LoginUser;