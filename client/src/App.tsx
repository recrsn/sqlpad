import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PadPage from "./features/pad/PadPage";
import LoginPage from "./features/session/LoginPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/pad" element={<PadPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
