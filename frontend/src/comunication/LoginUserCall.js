/**
 * Fetch methodes for user api calls
 * @author Jan Sigrist
 */


export const loginUser = async (email, password) => {
    const protocol = process.env.REACT_APP_API_PROTOCOL; // "http"
    const host = process.env.REACT_APP_API_HOST; // "localhost"
    const port = process.env.REACT_APP_API_PORT; // "8080"
    const path = process.env.REACT_APP_API_PATH; // "/api"
    const portPart = port ? `:${port}` : ''; // port is optional
    const API_URL = `${protocol}://${host}${portPart}${path}`;

    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (response.status === 401) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        } else if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Server response failed.');
        }

        const data = await response.json();
        console.log('User successfully logged in:', data);
        return data;
    } catch (error) {
        console.error('Failed to login user:', error.message);
        throw new Error('Failed to login user. ' || error.message);
    }
}
