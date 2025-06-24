import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import './App.css';
import './utils/axiosConfig';
import Home from './pages/Home';
import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";
import Users from './pages/user/Users';
import LoginUser from "./pages/user/LoginUser";
import RegisterUser from "./pages/user/RegisterUser";
import Secrets from "./pages/secret/Secrets";
import NewCredential from "./pages/secret/NewCredential";
import NewCreditCard from "./pages/secret/NewCreditCard";
import NewNote from "./pages/secret/NewNote";
import ForgotPassword from './pages/user/ForgotPassword';
import ResetPassword from './pages/user/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import OAuth2RedirectHandler from './pages/user/OAuth2RedirectHandler';

/**
 * App
 * @author Peter Rutschmann
 */
function App() {
    const [loginValues, setLoginValues] = useState({
        email: "",
        password: "",
    });
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
                <Route path="/" element={<Layout loginValues={loginValues}/>}>
                    <Route index element={<Home/>}/>
                    <Route path="user/users" element={
                        <PrivateRoute requiredRole="ROLE_ADMIN">
                            <Users loginValues={loginValues}/>
                        </PrivateRoute>
                    }/>
                    <Route path="user/login"
                           element={<LoginUser loginValues={loginValues} setLoginValues={setLoginValues}/>}/>
                    <Route path="user/register"
                           element={<RegisterUser loginValues={loginValues} setLoginValues={setLoginValues}/>}/>
                    <Route path="secret/secrets" element={
                        <PrivateRoute requiredRole="ROLE_USER">
                            <Secrets/>
                        </PrivateRoute>
                    }/>
                    <Route path="secret/newcredential" element={
                        <PrivateRoute requiredRole="ROLE_USER">
                            <NewCredential/>
                        </PrivateRoute>
                    }/>
                    <Route path="secret/newcreditcard" element={
                        <PrivateRoute requiredRole="ROLE_USER">
                            <NewCreditCard/>
                        </PrivateRoute>
                    }/>
                    <Route path="secret/newnote" element={
                        <PrivateRoute requiredRole="ROLE_USER">
                            <NewNote/>
                        </PrivateRoute>
                    }/>
                    <Route path="forgot-password" element={<ForgotPassword/>}/>
                    <Route path="reset-password" element={<ResetPassword/>}/>
                    <Route path="*" element={<NoPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;