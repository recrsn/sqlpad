import { Navigate, Route, RouteProps, useLocation } from "react-router-dom";
import useSessionStore from "./sessionStore";

export default function ProtectedRoute({ children, ...rest }: RouteProps) {
    const isActive = !!useSessionStore(state => state.sessionId);
    const location = useLocation();

    return (
        <Route
            {...rest}
            element={isActive ? children : <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} />}
        />
    );
}
