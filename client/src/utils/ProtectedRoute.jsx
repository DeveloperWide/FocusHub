import React from 'react'
import { isLoggedIn } from './auth';
import { Navigate } from 'react-router-dom';



const ProtectedRoute = ({ children }) => {
    return isLoggedIn() ?
        children
        : <Navigate to="/login"/>;
}

export default ProtectedRoute