import '../App.css';
import '../css/NoPage.css';
import { Link } from 'react-router-dom';

/**
 * NoPage
 * @author Peter Rutschmann
 */
const NoPage = () => {
    return(
        <div className="no-page-container">
            <h1 className="no-page-title">404</h1>
            <h2 className="no-page-subtitle">Seite nicht gefunden</h2>
            <p className="no-page-text">
                Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben. 
                Kehren Sie zur Startseite zurück und versuchen Sie es erneut.
            </p>
            <Link to="/" className="no-page-link">
                Zurück zur Startseite
            </Link>
        </div>
    )
};

export default NoPage;