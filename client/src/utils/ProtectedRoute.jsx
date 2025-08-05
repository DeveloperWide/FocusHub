import { getToken, getUser } from './auth'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const user = getUser();
    const token = getToken();
    if (!user || !token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default ProtectedRoute