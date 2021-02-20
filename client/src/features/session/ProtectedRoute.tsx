import React from "react";
import {Redirect, Route, RouteProps} from "react-router-dom";
import {useSession} from "./sessionHooks";

export default function ProtectedRoute({children, ...rest}: RouteProps) {
    const {isActive} = useSession();

    return (
        <Route
            {...rest}
            render={({location}) => {
                if (isActive) {
                    return (children);
                }

                return <Redirect
                    to={{
                        pathname: `/login`,
                        search: `?next=${location.pathname}`
                    }}
                />;
            }}
        />
    );
}
