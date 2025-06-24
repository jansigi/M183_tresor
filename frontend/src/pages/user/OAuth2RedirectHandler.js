import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

function OAuth2RedirectHandler() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('token', token);
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decoded = JSON.parse(window.atob(base64));
            localStorage.setItem('roles', JSON.stringify(decoded.roles || []));
            navigate('/');
        } else {
            navigate('/');
        }
    }, [navigate]);

    return <div>Logging you in...</div>;
}

export default OAuth2RedirectHandler; 