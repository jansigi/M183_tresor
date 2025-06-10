import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../../comunication/PasswordResetCall';
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../config/recaptcha";
import "../../css/Styles.css";

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const recaptchaRef = useRef(null);

    const [passwordStrength, setPasswordStrength] = useState({
        minLength: false,
        hasLowercase: false,
        hasUppercase: false,
        hasNumber: false,
        hasSymbol: false
    });

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        if (newPassword) {
            setPasswordStrength({
                minLength: newPassword.length >= 8,
                hasLowercase: /[a-z]/.test(newPassword),
                hasUppercase: /[A-Z]/.test(newPassword),
                hasNumber: /[0-9]/.test(newPassword),
                hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword)
            });
        }
    }, [newPassword]);

    const handleRecaptchaChange = (value) => {
        setRecaptchaValue(value);
    };

    const getRequirementStyle = (isValid) => ({
        color: isValid ? 'green' : '#777',
        fontWeight: isValid ? 'bold' : 'normal'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!recaptchaValue) {
            setErrorMessage('Please complete the reCAPTCHA verification');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        if (!Object.values(passwordStrength).every(Boolean)) {
            setErrorMessage('Password does not meet the strength requirements');
            return;
        }

        try {
            await resetPassword(token, newPassword, recaptchaValue);
            setSuccessMessage('Password has been reset successfully. Redirecting to login...');
            setTimeout(() => navigate('/user/login'), 3000);
        } catch (error) {
            console.error('Failed to reset password:', error);
            setErrorMessage(error.message);
            recaptchaRef.current.reset();
            setRecaptchaValue(null);
        }
    };

    return (
        <div className="form-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <div className="form-group">
                        <label>New Password</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className="eye-icon">
                                    {showPassword ? "👁️‍🗨️" : "👁️"}
                                </span>
                            </button>
                        </div>
                        <div className="password-requirements">
                            <p>Password requirements:</p>
                            <ul>
                                <li className="requirement-item">
                                    <span className={`checkbox-icon ${passwordStrength.minLength ? 'checked' : 'unchecked'}`}>
                                        {passwordStrength.minLength ? '✓' : '✗'}
                                    </span>
                                    <span style={getRequirementStyle(passwordStrength.minLength)}>
                                        At least 8 characters
                                    </span>
                                </li>
                                <li className="requirement-item">
                                    <span className={`checkbox-icon ${passwordStrength.hasLowercase ? 'checked' : 'unchecked'}`}>
                                        {passwordStrength.hasLowercase ? '✓' : '✗'}
                                    </span>
                                    <span style={getRequirementStyle(passwordStrength.hasLowercase)}>
                                        At least 1 lowercase letter
                                    </span>
                                </li>
                                <li className="requirement-item">
                                    <span className={`checkbox-icon ${passwordStrength.hasUppercase ? 'checked' : 'unchecked'}`}>
                                        {passwordStrength.hasUppercase ? '✓' : '✗'}
                                    </span>
                                    <span style={getRequirementStyle(passwordStrength.hasUppercase)}>
                                        At least 1 uppercase letter
                                    </span>
                                </li>
                                <li className="requirement-item">
                                    <span className={`checkbox-icon ${passwordStrength.hasNumber ? 'checked' : 'unchecked'}`}>
                                        {passwordStrength.hasNumber ? '✓' : '✗'}
                                    </span>
                                    <span style={getRequirementStyle(passwordStrength.hasNumber)}>
                                        At least 1 number
                                    </span>
                                </li>
                                <li className="requirement-item">
                                    <span className={`checkbox-icon ${passwordStrength.hasSymbol ? 'checked' : 'unchecked'}`}>
                                        {passwordStrength.hasSymbol ? '✓' : '✗'}
                                    </span>
                                    <span style={getRequirementStyle(passwordStrength.hasSymbol)}>
                                        At least 1 special character (e.g., !@#$%^&*)
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <div className="password-input-container">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <span className="eye-icon">
                                    {showConfirmPassword ? "👁️‍🗨️" : "👁️"}
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
                <button type="submit">Reset Password</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
        </div>
    );
}

export default ResetPassword; 