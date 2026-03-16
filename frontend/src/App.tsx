import { Link, Outlet } from 'react-router-dom';
import { AssignmentPanel } from './components/AssignmentPanel';
import { CreateAssignmentPanel } from './components/CreateAssignmentPanel';
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
              <img src="/icon-gauge.svg" alt="Dashboard Icon" width={22} height={22} />
              <span className="nav-label">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/calendar">
              <img src="/icon-calendar-days.svg" alt="Calendar Icon" width={22} height={22} />
              <span className="nav-label">Calendar</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="content">
        <Outlet />
      </div>
      <AssignmentPanel />
      <CreateAssignmentPanel />
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
