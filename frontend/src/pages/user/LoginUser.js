import {useNavigate} from 'react-router-dom';
import React, {useRef, useState} from "react";
import "../../css/Styles.css";
import ReCAPTCHA from "react-google-recaptcha";
import {RECAPTCHA_SITE_KEY} from "../../config/recaptcha";
import AuthService from "../../services/authService";

/**
 * LoginUser
 * @author Peter Rutschmann
 */
function LoginUser({loginValues, setLoginValues}) {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const recaptchaRef = useRef(null)

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

    const handleRecaptchaChange = (value) => {
        setRecaptchaValue(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!recaptchaValue) {
            setErrorMessage('Please complete the reCAPTCHA verification');
            return;
        }

        try {
            await AuthService.login(loginValues.email, loginValues.password, recaptchaValue);
            navigate('/');
        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            recaptchaRef.current.reset()
            setRecaptchaValue(null)
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
                                    {showPassword ? "👁️‍🗨️" : "👁️"}
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <ReCAPTCHA
                            sitekey={RECAPTCHA_SITE_KEY}
                            ref = {recaptchaRef}
                            onChange={handleRecaptchaChange}
                        />
                    </div>
                </div>
                <button type="submit">Login</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <p className="form-footer">
                    Forgot your password? <a href="/forgot-password" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>Reset it here</a>
                </p>
            </form>
        </div>
    );
}

export default LoginUser;