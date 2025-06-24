import '../../App.css';
import '../../css/Secrets.css';
import React, {useEffect, useState} from 'react';
import {getSecretsForUser} from "../../comunication/FetchSecrets";

/**
 * Secrets
 * @author Peter Rutschmann
 */
const Secrets = () => {
    const [secrets, setSecrets] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchSecrets = async () => {
        setErrorMessage('');
        if (!localStorage.getItem("token")) {
            console.error('Secrets: No valid token');
            setErrorMessage("No valid token, please do login first.");
        } else {
            try {
                const data = await getSecretsForUser();
                console.log(data)
                setSecrets(data);
            } catch (error) {
                console.error('Failed to fetch to server:', error.message);
                setErrorMessage(error.message);
            }
        }
    };

    useEffect(() => {
        fetchSecrets();
    }, []);

    const renderCredentialCard = (content) => {
        return (
            <div className="secret-card credential-card">
                <div className="card-header">
                    <h3>Credential</h3>
                </div>
                <div className="card-content">
                    <p>
                        <strong>Website</strong>
                        <span>{content.url}</span>
                    </p>
                    <p>
                        <strong>Username</strong>
                        <span>{content.userName}</span>
                    </p>
                    <p>
                        <strong>Password</strong>
                        <span>{content.password}</span>
                    </p>
                </div>
            </div>
        );
    };

    const renderCreditCard = (content) => {
        return (
            <div className="secret-card credit-card">
                <div className="card-header">
                    <h3>Credit Card</h3>
                </div>
                <div className="card-content">
                    <p>
                        <strong>Card Number</strong>
                        <span>{content.cardnumber}</span>
                    </p>
                    <p>
                        <strong>Card Type</strong>
                        <span>{content.cardtype}</span>
                    </p>
                    <p>
                        <strong>Expiry Date</strong>
                        <span>{content.expiration}</span>
                    </p>
                    <p>
                        <strong>CVV</strong>
                        <span>{content.cvv}</span>
                    </p>
                </div>
            </div>
        );
    };

    const renderNote = (content) => {
        return (
            <div className="secret-card note-card">
                <div className="card-header">
                    <h3>Note</h3>
                </div>
                <div className="card-content">
                    <p>
                        <strong>Title</strong>
                        <span>{content.title}</span>
                    </p>
                    <p>
                        <strong>Content</strong>
                        <span>{content.content}</span>
                    </p>
                </div>
            </div>
        );
    };

    const renderSecret = (secret) => {
        const content = JSON.parse(secret.content)
        switch(content.kindid) {
            case 1:
                return renderCredentialCard(content);
            case 2:
                return renderCreditCard(content);
            case 3:
                return renderNote(content);
            default:
                return null;
        }
    };

    return (
        <div className="secrets-container">
            <h1>My Secrets</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="secrets-grid">
                {secrets?.length > 0 ? (
                    secrets.map(secret => (
                        <div key={secret.id} className="secret-item">
                            {renderSecret(secret)}
                        </div>
                    ))
                ) : (
                    <p className="no-secrets">No secrets available</p>
                )}
            </div>
        </div>
    );
};

export default Secrets;