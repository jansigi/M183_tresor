import '../App.css';
import '../css/Home.css';

/**
 * Home
 * @author Peter Rutschmann
 */
const Home = () => {
    return (
        <div className="home-container">
            <h1 className="home-title">Speichern Sie Ihre Daten sicher ab.</h1>
            <div className="home-content">
                <p className="home-description">
                    In dieser Applikation können Sie, nachdem Sie sich registriert haben, Ihre sensitiven Daten verschlüsselt
                    in einer Datenbank speichern.
                </p>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3 className="feature-title">Credentials</h3>
                        <p className="feature-description">
                            Speichern Sie Ihre Zugangsdaten sicher und verschlüsselt.
                        </p>
                    </div>
                    <div className="feature-card">
                        <h3 className="feature-title">Credit Cards</h3>
                        <p className="feature-description">
                            Bewahren Sie Ihre Kreditkarteninformationen sicher auf.
                        </p>
                    </div>
                    <div className="feature-card">
                        <h3 className="feature-title">Notes</h3>
                        <p className="feature-description">
                            Erstellen Sie verschlüsselte Notizen für sensitive Informationen.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;