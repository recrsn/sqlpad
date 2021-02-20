import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import PadPage from "./features/pad/PadPage";
import LoginPage from "./features/session/LoginPage";
import ProtectedRoute from "./features/session/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/login">
                    <LoginPage/>
                </Route>
                <ProtectedRoute path="/pad">
                    <PadPage/>
                </ProtectedRoute>
                <Redirect exact path="/" to="/pad"/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
