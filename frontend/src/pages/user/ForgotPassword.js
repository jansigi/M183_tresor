import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../../comunication/PasswordResetCall';
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../config/recaptcha";
import "../../css/Styles.css";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const recaptchaRef = useRef(null);

    const handleRecaptchaChange = (value) => {
        setRecaptchaValue(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!recaptchaValue) {
            setErrorMessage('Please complete the reCAPTCHA verification');
            return;
        }

        try {
            await requestPasswordReset(email, recaptchaValue);
            setSuccessMessage('If an account exists with this email, you will receive a password reset link.');
            recaptchaRef.current.reset();
            setRecaptchaValue(null);
        } catch (error) {
            console.error('Failed to request password reset:', error);
            setErrorMessage(error.message);
            recaptchaRef.current.reset();
            setRecaptchaValue(null);
        }
    };

    return (
        <div className="form-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <ReCAPTCHA
                            sitekey={RECAPTCHA_SITE_KEY}
                            ref={recaptchaRef}
                            onChange={handleRecaptchaChange}
                        />
                    </div>
                </div>
                <button type="submit">Request Password Reset</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <p className="form-footer">
                    Remember your password? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Login here</a>
                </p>
            </form>
        </div>
    );
}

export default ForgotPassword; 