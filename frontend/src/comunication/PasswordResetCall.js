const API_URL = 'http://localhost:8080';

export const requestPasswordReset = async (email, recaptchaToken) => {
    const response = await fetch(`${API_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            recaptchaToken
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to request password reset');
    }

    return response.json();
};

export const resetPassword = async (token, newPassword, recaptchaToken) => {
    const response = await fetch(`${API_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token,
            newPassword,
            recaptchaToken
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reset password');
    }

    return response.json();
}; 