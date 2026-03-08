import { Link, Outlet } from 'react-router-dom';
import { AssignmentPanel } from './components/AssignmentPanel';
import { ChangeReviewPanel } from './components/ChangeReviewPanel';
import { ImportPanel } from './components/ImportPanel';
import { CalendarProvider } from './context/CalendarContext';
import './App.css';

const Layout = () => {
  return (
    <div className="app-shell">
      <nav className="sidebar">
        <h2 className="app-title">Calendar Prototype</h2>
        <ul>
          <li>
            <Link to="/">Calendar</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
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
