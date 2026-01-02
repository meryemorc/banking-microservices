import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import TransferPage from './pages/TransferPage';
import TransactionPage from './pages/TransactionPage';
import CreditApply from './pages/CreditApply';
import MyCreditsPage from './pages/MyCreditsPage';
import AdminPanelPage from './pages/AdminPanelPage';

// Giriş kontrolü
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Herkese açık sayfalar */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Giriş gerekli sayfalar */}
                <Route path="/dashboard" element={
                    <PrivateRoute><Dashboard /></PrivateRoute>
                } />
                <Route path="/transfer" element={
                    <PrivateRoute><TransferPage /></PrivateRoute>
                } />
                <Route path="/transactions" element={
                    <PrivateRoute><TransactionPage /></PrivateRoute>
                } />
                <Route path="/credit-apply" element={
                    <PrivateRoute><CreditApply /></PrivateRoute>
                } />
                <Route path="/my-credits" element={
                    <PrivateRoute><MyCreditsPage /></PrivateRoute>
                } />
                <Route path="/admin" element={
                    <PrivateRoute><AdminPanelPage /></PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;