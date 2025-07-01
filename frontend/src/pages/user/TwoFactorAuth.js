import React, {useState} from 'react';
import {useLocation} from 'react-router-dom';
import '../../css/Styles.css';
import axios from 'axios';
import authService from "../../services/authService";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function TwoFactorAuth() {
    const location = useLocation();
    const {email} = location.state || {};
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [resendMsg, setResendMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        authService.verify2Fa(email, code)
            .catch(e => setError(e.response?.data?.message || 'Invalid code or error occurred.'))
            .then(() => {
                if (error === '') {
                    window.location = '/'
                }
            });
        setLoading(false);
    };

    const handleResend = async () => {
        setResendMsg('');
        setError('');
        setLoading(true);
        try {
            await axios.post(`${API_URL}/users/2fa/resend`, {email});
            setResendMsg('A new code has been sent to your email.');
        } catch (err) {
            setError('Failed to resend code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Two-Factor Authentication</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Enter the 2FA code sent to your email</label>
                    <input
                        type="text"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        required
                        maxLength={6}
                        placeholder="6-digit code"
                    />
                </div>
                <button type="submit" disabled={loading}>Verify</button>
                {error && <p className="error-message">{error}</p>}
                {resendMsg && <p style={{color: 'green', textAlign: 'center'}}>{resendMsg}</p>}
            </form>
            <button onClick={handleResend} disabled={loading} style={{marginTop: '1rem'}}>Resend Code</button>
        </div>
    );
}

export default TwoFactorAuth; 