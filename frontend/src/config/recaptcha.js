const RECAPTCHA_SITE_KEY = process.env.REACT_APP_API_RECAPTCHA;
const RECAPTCHA_SECRET_KEY = process.env.REACT_APP_API_RECAPTCHA_SECRET;

if (!RECAPTCHA_SITE_KEY) {
    console.error('REACT_APP_API_RECAPTCHA is not defined in environment variables');
}

if (!RECAPTCHA_SECRET_KEY) {
    console.error('REACT_APP_API_RECAPTCHA_SECRET is not defined in environment variables');
}

export { RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY };
