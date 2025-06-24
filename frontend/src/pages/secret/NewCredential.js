import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {postSecret} from "../../comunication/FetchSecrets";
import "../../css/Styles.css";

/**
 * NewCredential
 * @author Peter Rutschmann
 */
function NewCredential() {
    const initialState = {
        kindid: 1,
        kind:"credential",
        userName: "",
        password: "",
        url: ""
    };
    const [credentialValues, setCredentialValues] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const content = credentialValues;
            await postSecret({content});
            setCredentialValues(initialState);
            navigate('/secret/secrets');
        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="secret-form-container">
            <h2>New Credential</h2>
            <form onSubmit={handleSubmit}>
                <div className="secret-form-section">
                    <div className="secret-form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={credentialValues.userName}
                            onChange={(e) =>
                                setCredentialValues(prevValues => ({...prevValues, userName: e.target.value}))}
                            required
                            placeholder="Enter username"
                        />
                    </div>
                    <div className="secret-form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={credentialValues.password}
                            onChange={(e) =>
                                setCredentialValues(prevValues => ({...prevValues, password: e.target.value}))}
                            required
                            placeholder="Enter password"
                        />
                    </div>
                    <div className="secret-form-group">
                        <label>URL</label>
                        <input
                            type="url"
                            value={credentialValues.url}
                            onChange={(e) =>
                                setCredentialValues(prevValues => ({...prevValues, url: e.target.value}))}
                            required
                            placeholder="Enter website URL"
                        />
                    </div>
                    <div className="secret-form-actions">
                        <button type="submit">Save Credential</button>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            </form>
        </div>
    );
}

export default NewCredential;
