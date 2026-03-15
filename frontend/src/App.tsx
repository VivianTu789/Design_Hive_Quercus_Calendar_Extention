import { Link, Outlet } from 'react-router-dom';
import { Gauge, CalendarDays } from 'lucide-react';
import { AssignmentPanel } from './components/AssignmentPanel';
import { ChangeReviewPanel } from './components/ChangeReviewPanel';
import { ImportPanel } from './components/ImportPanel';
import { CalendarProvider } from './context/CalendarContext';
import './App.css';

const Layout = () => {
  return (
    <div className="app-shell">
      <nav className="sidebar">
        <div className="sidebar-logo-wrap">
          <img src="/main_logo.jpg" alt="Main Logo" className="sidebar-logo-img" />
        </div>
        <ul>
          <li>
            <Link to="/dashboard">
              <Gauge size={22} strokeWidth={1.75} />
              <span className="nav-label">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/calendar">
              <CalendarDays size={22} strokeWidth={1.75} />
              <span className="nav-label">Calendar</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="content">
        <Outlet />
      </div>
      <AssignmentPanel />
      <ImportPanel />
      <ChangeReviewPanel />
    </div>
  );
};

const App = () => {
  return (
    <CalendarProvider>
      <Layout />
    </CalendarProvider>
  );
};

export default App;
