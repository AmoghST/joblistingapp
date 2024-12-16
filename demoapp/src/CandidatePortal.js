import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CandidatePortal.css'; // Import the CSS file

const CandidatePortal = () => {
  const [jobs, setJobs] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [contact, setContact] = useState('');
  const [jobId, setJobId] = useState('');

  // Set the API base URL
  const API_BASE_URL = 'http://localhost:5000'; // Change this if you are deploying on a different server
  
  // Fetch available jobs
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/candidate/jobs`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Apply for a job
  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/candidate/apply`, {
        candidateName,
        contact,
        jobId,
      });
      alert('Application submitted successfully!');
      setCandidateName('');
      setContact('');
      setJobId('');
    } catch (error) {
      console.error('Error applying for job:', error);
    }
  };

  return (
    <div className="candidate-portal">
      <h2 className="header">Candidate Portal</h2>
      
      <input
        type="text"
        className="search-input"
        placeholder="Search by location"
        value={searchLocation}
        onChange={(e) => setSearchLocation(e.target.value)}
      />

      <h3 className="job-list-header">Available Jobs</h3>
      <ul className="job-list">
        {jobs
          .filter((job) => job.location.toLowerCase().includes(searchLocation.toLowerCase()))
          .map((job) => (
            <li key={job.id} className="job-item">
              <strong>{job.jobTitle}</strong> - {job.location} - ${job.salary}
              <p>{job.description}</p>
              <button className="apply-btn" onClick={() => setJobId(job.id)}>Apply</button>
            </li>
          ))}
      </ul>

      {jobId && (
        <form onSubmit={handleApply} className="apply-form">
          <h4>Apply for Job ID: {jobId}</h4>
          <input
            type="text"
            className="input-field"
            placeholder="Your Name"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            required
          />
          <input
            type="text"
            className="input-field"
            placeholder="Your Contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
          <button type="submit" className="submit-btn">Submit Application</button>
        </form>
      )}
    </div>
  );
};

export default CandidatePortal;
