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
        const {name, value} = e.target;
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
            AuthService.login(loginValues.email, loginValues.password, recaptchaValue)
                .then(response => {
                    console.log(response)
                    if (response && response.twoFaRequired) {
                        navigate('/2fa', {state: {email: response.email}});
                    } else {
                        navigate('/');
                    }
                })

        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            recaptchaRef.current.reset();
            setRecaptchaValue(null);
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
                            ref={recaptchaRef}
                            onChange={handleRecaptchaChange}
                        />
                    </div>
                </div>
                <button type="submit">Login</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <p className="form-footer">
                    Forgot your password? <a href="/forgot-password" onClick={(e) => {
                    e.preventDefault();
                    navigate('/forgot-password');
                }}>Reset it here</a>
                </p>
            </form>
            <div style={{margin: '2rem 0 0 0', textAlign: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', margin: '2rem 0 1.5rem 0'}}>
                    <hr style={{flex: 1, border: 'none', borderTop: '1.5px solid #e2e8f0'}}/>
                    <span style={{margin: '0 1rem', color: '#888', fontSize: '1rem'}}>or</span>
                    <hr style={{flex: 1, border: 'none', borderTop: '1.5px solid #e2e8f0'}}/>
                </div>
                <button
                    type="button"
                    className="google-login-btn"
                    onClick={() => {
                        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
                    }}
                >
                    <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <span className="google-icon" aria-hidden="true"
                              style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <svg width="22" height="22" viewBox="0 0 48 48"><g><path fill="#4285F4"
                                                                                     d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.09 30.13 0 24 0 14.82 0 6.73 5.13 2.69 12.56l7.98 6.2C12.13 13.13 17.62 9.5 24 9.5z"/><path
                                fill="#34A853"
                                d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.09 46.1 31.3 46.1 24.55z"/><path
                                fill="#FBBC05"
                                d="M9.67 28.76c-1.13-3.36-1.13-6.99 0-10.35l-7.98-6.2C-1.13 17.09-1.13 30.91 1.69 37.44l7.98-6.2z"/><path
                                fill="#EA4335"
                                d="M24 46c6.13 0 11.64-2.09 15.98-5.72l-7.19-5.6c-2.01 1.35-4.6 2.15-7.79 2.15-6.38 0-11.87-3.63-14.33-8.86l-7.98 6.2C6.73 42.87 14.82 48 24 48z"/><path
                                fill="none" d="M0 0h48v48H0z"/></g></svg>
                        </span>
                        <span style={{marginLeft: '10px'}}>Login with Google</span>
                    </span>
                </button>
                <button
                    type="button"
                    className="github-login-btn"
                    style={{marginTop: '10px'}}
                    onClick={() => {
                        window.location.href = 'http://localhost:8080/oauth2/authorization/github';
                    }}
                >
                    <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <span className="github-icon" aria-hidden="true"
                              style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path
                                d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.468-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.046.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.104.823 2.226 0 1.606-.014 2.898-.014 3.293 0 .322.218.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"/></svg>
                        </span>
                        <span style={{marginLeft: '10px'}}>Login with GitHub</span>
                    </span>
                </button>
            </div>
        </div>
    );
}

export default LoginUser;