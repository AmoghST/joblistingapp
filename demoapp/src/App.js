import logo from './logo.svg';
import './App.css';
import AdminPanel from './AdminPanel';
import CandidatePortal from './CandidatePortal';

const App = () => {
  return (
    <div>
      <h1>Job Listing and Application Portal</h1>
      <AdminPanel />
      <hr />
      <CandidatePortal />
    </div>
  );
};

export default App;
