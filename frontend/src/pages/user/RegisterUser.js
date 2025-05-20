import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {postUser} from "../../comunication/FetchUser";
import "../../css/Styles.css";
import isStrongPassword from "validator/es/lib/isStrongPassword";

/**
 * RegisterUser
 * @author Peter Rutschmann
 */
function RegisterUser({loginValues, setLoginValues}) {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    let options = {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
        pointsPerUnique: 1,
        pointsPerRepeat: 0.5,
        pointsForContainingLower: 10,
        pointsForContainingUpper: 10,
        pointsForContainingNumber: 10,
        pointsForContainingSymbol: 10
    };
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
    const [passwordStrength, setPasswordStrength] = useState({
        minLength: false,
        hasLowercase: false,
        hasUppercase: false,
        hasNumber: false,
        hasSymbol: false
    });

    useEffect(() => {
        if (credentials.password) {
            setPasswordStrength({
                minLength: credentials.password.length >= 8,
                hasLowercase: /[a-z]/.test(credentials.password),
                hasUppercase: /[A-Z]/.test(credentials.password),
                hasNumber: /[0-9]/.test(credentials.password),
                hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(credentials.password)
            });
        } else {
            setPasswordStrength({
                minLength: false,
                hasLowercase: false,
                hasUppercase: false,
                hasNumber: false,
                hasSymbol: false
            });
        }
    }, [credentials.password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        //validate
        if (credentials.password !== credentials.passwordConfirmation) {
            console.log("password != passwordConfirmation");
            setErrorMessage('Password and password-confirmation are not equal.');
            return;
        }

        if (!isStrongPassword(credentials.password, options)) {
            console.log("password is not strong");
            setErrorMessage('Password does not meet the strength requirements. Please check the criteria.');
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

    const getRequirementStyle = (isValid) => ({
        color: isValid ? 'green' : '#777',
        fontWeight: isValid ? 'bold' : 'normal'
    });

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
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={credentials.password}
                                onChange={(e) =>
                                    setCredentials(prevValues => ({...prevValues, password: e.target.value}))}
                                required
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className="eye-icon">
                                    {showPassword ? "👁️" : "👁️‍🗨️"}
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
                        <label>Confirm Password</label>
                        <div className="password-input-container">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={credentials.passwordConfirmation}
                                onChange={(e) =>
                                    setCredentials(prevValues => ({...prevValues, passwordConfirmation: e.target.value}))}
                                required
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <span className="eye-icon">
                                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <button type="submit">Register</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
        </div>
    );
}

export default RegisterUser;
