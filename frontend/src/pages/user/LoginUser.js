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
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
                            type="text"
                            name="email"
                            value={loginValues.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={loginValues.password}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={togglePasswordVisibility}
                            >
                                <span className="eye-icon">
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <button type="submit">Login</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
    );
}

export default LoginUser;