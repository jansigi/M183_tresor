import '../../App.css';
import './Secrets.css';
import React, {useEffect, useState} from 'react';
import {getSecretsforUser} from "../../comunication/FetchSecrets";

/**
 * Secrets
 * @author Peter Rutschmann
 */
const Secrets = ({loginValues}) => {
    const [secrets, setSecrets] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchSecrets = async () => {
            setErrorMessage('');
            if( ! loginValues.email){
                console.error('Secrets: No valid email, please do login first:' + loginValues);
                setErrorMessage("No valid email, please do login first.");
            } else {
                try {
                    const data = await getSecretsforUser(loginValues);
                    console.log(data);
                    setSecrets(data);
                } catch (error) {
                    console.error('Failed to fetch to server:', error.message);
                    setErrorMessage(error.message);
                }
            }
        };
        fetchSecrets();
    }, [loginValues]);

    const renderCredentialCard = (content) => {
        return (
            <div className="secret-card credential-card">
                <div className="card-header">
                    <h3>Credential</h3>
                </div>
                <div className="card-content">
                    <p><strong>Website:</strong> {content.url}</p>
                    <p><strong>Username:</strong> {content.userName}</p>
                    <p><strong>Password:</strong> {content.password}</p>
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
                    <p><strong>Card Number:</strong> {content.cardnumber}</p>
                    <p><strong>CVV:</strong> {content.cvv}</p>
                    <p><strong>Expiry:</strong> {content.expiration}</p>
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
                    <p><strong>Title:</strong> {content.title}</p>
                    <p><strong>Content:</strong> {content.content}</p>
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