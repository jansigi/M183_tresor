const RECAPTCHA_SITE_KEY = process.env.REACT_APP_API_RECAPTCHA;

if (!RECAPTCHA_SITE_KEY) {
    console.error('REACT_APP_API_RECAPTCHA is not defined in environment variables');
}

export {RECAPTCHA_SITE_KEY};
