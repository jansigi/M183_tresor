import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {postUser} from "../../comunication/FetchUser";
import "../../css/Styles.css";

/**
 * RegisterUser
 * @author Peter Rutschmann
 */
function RegisterUser({loginValues, setLoginValues}) {
    const navigate = useNavigate();

    const initialState = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errorMessage: ""
    };
    const [credentials, setCredentials] = useState(initialState);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        //validate
        if(credentials.password !== credentials.passwordConfirmation) {
            console.log("password != passwordConfirmation");
            setErrorMessage('Password and password-confirmation are not equal.');
            return;
        }

        try {
            await postUser(credentials);
            setLoginValues({userName: credentials.email, password: credentials.password});
            setCredentials(initialState);
            navigate('/');
        } catch (error) {
            console.error('Failed to fetch to server:', error.message);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-section">
                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            value={credentials.firstName}
                            onChange={(e) =>
                                setCredentials(prevValues => ({...prevValues, firstName: e.target.value}))}
                            required
                            placeholder="Enter your first name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            value={credentials.lastName}
                            onChange={(e) =>
                                setCredentials(prevValues => ({...prevValues, lastName: e.target.value}))}
                            required
                            placeholder="Enter your last name"
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={credentials.email}
                            onChange={(e) =>
                                setCredentials(prevValues => ({...prevValues, email: e.target.value}))}
                            required
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) =>
                                setCredentials(prevValues => ({...prevValues, password: e.target.value}))}
                            required
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={credentials.passwordConfirmation}
                            onChange={(e) =>
                                setCredentials(prevValues => ({...prevValues, passwordConfirmation: e.target.value}))}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>
                </div>
                <button type="submit">Register</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
    );
}

export default RegisterUser;
