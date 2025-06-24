import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {postSecret} from "../../comunication/FetchSecrets";
import "../../css/Styles.css";

/**
 * NewCreditCard
 * @author Peter Rutschmann
 */
function NewCreditCard() {
    const initialState = {
        kindid: 2,
        kind:"creditcard",
        cardtype: "",
        cardnumber: "",
        expiration: "",
        cvv: ""
    };
    const [creditCardValues, setCreditCardValues] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const content = creditCardValues;
            await postSecret({content});
            setCreditCardValues(initialState);
            navigate('/secret/secrets');
        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="secret-form-container">
            <h2>New Credit Card</h2>
            <form onSubmit={handleSubmit} className="credit-card-form">
                <div className="secret-form-section">
                    <div className="secret-form-group">
                        <label>Card Type</label>
                        <select
                            value={creditCardValues.cardtype}
                            onChange={(e) =>
                                setCreditCardValues((prevValues) => ({
                                    ...prevValues,
                                    cardtype: e.target.value,
                                }))}
                            required
                        >
                            <option value="" disabled>
                                Select card type
                            </option>
                            <option value="Visa">Visa</option>
                            <option value="Mastercard">Mastercard</option>
                        </select>
                    </div>
                    <div className="secret-form-group">
                        <label>Card Number</label>
                        <input
                            type="text"
                            name="cardnumber"
                            value={creditCardValues.cardnumber}
                            onChange={(e) =>
                                setCreditCardValues(prevValues => ({...prevValues, cardnumber: e.target.value}))}
                            required
                            placeholder="Enter card number"
                            maxLength="19"
                            pattern="[0-9\s]{13,19}"
                        />
                    </div>
                    <div className="secret-form-group">
                        <label>Expiration Date</label>
                        <input
                            type="text"
                            name="expiration"
                            value={creditCardValues.expiration}
                            onChange={(e) =>
                                setCreditCardValues(prevValues => ({...prevValues, expiration: e.target.value}))}
                            required
                            placeholder="MM/YY"
                            maxLength="5"
                            pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                        />
                    </div>
                    <div className="secret-form-group">
                        <label>CVV</label>
                        <input
                            type="text"
                            name="cvv"
                            value={creditCardValues.cvv}
                            onChange={(e) =>
                                setCreditCardValues(prevValues => ({...prevValues, cvv: e.target.value}))}
                            required
                            placeholder="Enter CVV"
                            maxLength="4"
                            pattern="[0-9]{3,4}"
                        />
                    </div>
                    <div className="secret-form-actions">
                        <button type="submit">Save Credit Card</button>
                    </div>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </div>
            </form>
        </div>
    );
}

export default NewCreditCard;
