import {Link, Outlet, useNavigate} from "react-router-dom";
import "../css/Styles.css";
import authService from "../services/authService";

/**
 * Layout
 * @author Peter Rutschmann
 */
const Layout = () => {
    const navigate = useNavigate();
    const isAuthenticated = authService.isAuthenticated();
    const isAdmin = authService.hasRole('ROLE_ADMIN');
    const userEmail = authService.getUserEmail();

    const handleLogout = () => {
        authService.logout();
        navigate('/user/login');
    };

    return (
        <>
            <nav>
                <div className="nav-brand">
                    <h1>The Secret Tresor</h1>
                    <p className="user-info">
                        {isAuthenticated && userEmail ? `Logged in as ${userEmail}` : 'No user logged in'}
                    </p>
                </div>
                <ul>
                    {isAuthenticated && (
                        <li>
                            <Link to="secret/secrets">Secrets</Link>
                            <ul>
                                <li><Link to="secret/secrets">My Secrets</Link></li>
                                <li><Link to="secret/newcredential">New Credential</Link></li>
                                <li><Link to="secret/newcreditcard">New Credit Card</Link></li>
                                <li><Link to="secret/newnote">New Note</Link></li>
                            </ul>
                        </li>
                    )}
                    {!isAuthenticated ? (
                            <li>
                                <Link to="/">User</Link>
                                <ul>
                                    <>
                                        <li><Link to="user/login">Login</Link></li>
                                        <li><Link to="user/register">Register</Link></li>
                                    </>
                                </ul>
                            </li>
                        )
                        : (
                            <>
                                <button onClick={handleLogout}>Logout</button>
                            </>
                        )}
                    {isAdmin && (
                        <li>
                            <Link to="/">Admin</Link>
                            <ul>
                                <li><Link to="user/users">All Users</Link></li>
                            </ul>
                        </li>
                    )}
                    <li>
                        <Link to="/">About</Link>
                    </li>
                </ul>
            </nav>
            <main className="main-content">
                <Outlet/>
            </main>
        </>
    );
};

export default Layout;