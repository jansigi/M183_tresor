/**
 * Fetch methodes for user api calls
 * @author Peter Rutschmann
 */

import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const getUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'Get',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Server response failed.');
        }

        const data = await response.json();
        console.log('User successfully got:', data);
        return data;
    } catch (error) {
        console.error('Failed to get user:', error.message);
        throw new Error('Failed to get user. ' || error.message);
    }
}

export const postUser = async (userData) => {
    try {
        console.log("recaptchaToken:", userData.recaptchaToken)
        const response = await axios.post(`${API_URL}/users`, {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            recaptchaToken: userData.recaptchaToken
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};