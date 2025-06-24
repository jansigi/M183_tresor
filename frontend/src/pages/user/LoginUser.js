import {useNavigate} from 'react-router-dom';
import React, {useEffect, useRef, useState} from "react";
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

    // Handle Google OAuth2 login response
    useEffect(() => {
        try {
            // Try to parse the page as JSON (Google login returns JSON)
            const bodyText = document.body.innerText;
            const data = JSON.parse(bodyText);
            if (data.token) {
                localStorage.setItem('token', data.token);
                // Parse roles from either the token or the response
                let roles = data.roles;
                if (!roles) {
                    // Try to decode from JWT if not present
                    const base64Url = data.token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const decoded = JSON.parse(window.atob(base64));
                    roles = decoded.roles || [];
                }
                localStorage.setItem('roles', JSON.stringify(roles));
                navigate('/');
            }
        } catch (e) {
            // Not a JSON response, ignore
        }
    }, [navigate]);

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
            <div style={{ margin: '2rem 0 0 0', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0 1.5rem 0' }}>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1.5px solid #e2e8f0' }} />
                    <span style={{ margin: '0 1rem', color: '#888', fontSize: '1rem' }}>or</span>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1.5px solid #e2e8f0' }} />
                </div>
                <button
                    type="button"
                    className="google-login-btn"
                    onClick={() => { window.location.href = 'http://localhost:8080/oauth2/authorization/google'; }}
                >
                    <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <span className="google-icon" aria-hidden="true" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <svg width="22" height="22" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.09 30.13 0 24 0 14.82 0 6.73 5.13 2.69 12.56l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.09 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M9.67 28.76c-1.13-3.36-1.13-6.99 0-10.35l-7.98-6.2C-1.13 17.09-1.13 30.91 1.69 37.44l7.98-6.2z"/><path fill="#EA4335" d="M24 46c6.13 0 11.64-2.09 15.98-5.72l-7.19-5.6c-2.01 1.35-4.6 2.15-7.79 2.15-6.38 0-11.87-3.63-14.33-8.86l-7.98 6.2C6.73 42.87 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
                        </span>
                        <span style={{marginLeft: '10px'}}>Login with Google</span>
                    </span>
                </button>
            </div>
        </div>
    );
}

export default LoginUser;