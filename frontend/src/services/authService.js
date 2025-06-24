import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class AuthService {
    login(email, password, recaptchaToken) {
        return axios
            .post(`${API_URL}/users/login`, {
                email,
                password,
                recaptchaToken
            })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    const decodedToken = this.parseJwt(response.data.token);
                    console.log('Decoded Token:', decodedToken);
                    localStorage.setItem('roles', JSON.stringify(decodedToken.roles || []));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
    }

    isAuthenticated() {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        const decodedToken = this.parseJwt(token);
        if (!decodedToken) return false;
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        return decodedToken.exp > currentTime;
    }

    hasRole(role) {
        const roles = JSON.parse(localStorage.getItem('roles') || '[]');
        return roles.includes(role);
    }

    getAuthHeader() {
        const token = localStorage.getItem('token');
        if (token) {
            return { Authorization: 'Bearer ' + token };
        } else {
            return {};
        }
    }

    parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64));
        } catch (e) {
            return null;
        }
    }
}

export default new AuthService(); 