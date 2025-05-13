import { Outlet, Link } from "react-router-dom";
import "../css/Styles.css";

/**
 * Layout
 * @author Peter Rutschmann
 */
const Layout = ({loginValues}) => {
    return (
        <>
            <nav>
                <div className="nav-brand">
                    <h1>The Secret Tresor</h1>
                    <p className="user-info">{loginValues.email === '' ? 'No user logged in' : `Logged in as: ${loginValues.email}`}</p>
                </div>
                <ul>
                    <li>
                        <Link to="/">Secrets</Link>
                        <ul>
                            <li><Link to="/secret/secrets">My Secrets</Link></li>
                            <li><Link to="/secret/newcredential">New Credential</Link></li>
                            <li><Link to="/secret/newcreditcard">New Credit Card</Link></li>
                            <li><Link to="/secret/newnote">New Note</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/">User</Link>
                        <ul>
                            <li><Link to="/user/login">Login</Link></li>
                            <li><Link to="/user/register">Register</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/">Admin</Link>
                        <ul>
                            <li><Link to="/user/users">All Users</Link></li>
                            <li><Link to="/user/users/:id">Edit User</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/">About</Link>
                    </li>
                </ul>
            </nav>
            <main className="main-content">
                <Outlet/>
            </main>
        </>
    )
};

export default Layout;