/**
 * Fetch methodes for user api calls
 * @author Jan Sigrist
 */

import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const loginUser = async (email, password, recaptchaToken) => {
    try {
        console.log('recaptchaToken:', recaptchaToken);
        const response = await axios.post(`${API_URL}/users/login`, {
            email,
            password,
            recaptchaToken
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
    }
};
