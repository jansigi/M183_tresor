import '../../App.css';
import '../../css/Users.css';
import React, {useEffect, useState} from "react";
import {getUsers} from "../../comunication/FetchUser";

/**
 * Users
 * @author Peter Rutschmann
 */
const Users = ({loginValues}) => {
    const [users, setUsers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await getUsers();
                console.log(users);
                setUsers(users);
            } catch (error) {
                console.error('Failed to fetch to server:', error.message);
                setErrorMessage(error.message);
            }
        };
        fetchUsers();
    }, [loginValues]);

    return (
        <div className="users-container">
            <h1>Client List</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Roles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td>{user.roles.map(role => role.name).join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;