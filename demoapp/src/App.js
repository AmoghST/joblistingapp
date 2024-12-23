import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AdminPanel from './components/AdminPanel';
import CandidatePortal from './components/CandidatePortal';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';

const App = () => {
  return (
    <>
    <Router>
    <Navbar/>
      <div>
        <Routes>
          <Route path="/" element={<AdminPanel />} />
          <Route path="/candidateportal" element={<CandidatePortal />} />
          <Route path="/chatbot" element={<Chatbot />} />

          
        </Routes>
      </div>
    </Router> 
    </>
  );
};

export default App;
