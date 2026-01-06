import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context';
import { ProtectedRoute } from './components/common';
import { Layout } from './components/layout';
import {
    LoginPage,
    RegisterPage,
    DashboardPage,
    AccountsPage,
    TransferPage,
    TransactionsPage,
    CreditsPage,
    AdminCreditsPage
} from './pages';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#1e293b',
                            color: '#fff',
                            borderRadius: '10px',
                        },
                        success: {
                            iconTheme: {
                                primary: '#22c55e',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />

                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected Routes */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="accounts" element={<AccountsPage />} />
                        <Route path="accounts/new" element={<AccountsPage />} />
                        <Route path="transfer" element={<TransferPage />} />
                        <Route path="transactions" element={<TransactionsPage />} />
                        <Route path="credits" element={<CreditsPage />} />
                        <Route path="settings" element={<DashboardPage />} />

                        {/* Admin Routes */}
                        <Route path="admin/credits" element={
                            <ProtectedRoute adminOnly>
                                <AdminCreditsPage />
                            </ProtectedRoute>
                        } />
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;