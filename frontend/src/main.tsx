import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { CalendarPage } from './pages/CalendarPage';
import { DashboardPage } from './pages/DashboardPage';
import { CalendarProvider } from './context/CalendarContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CalendarProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            {/* Default to dashboard on initial load */}
            <Route index element={<DashboardPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            {/* Fallback: any unknown route under / goes to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CalendarProvider>
  </StrictMode>,
);
