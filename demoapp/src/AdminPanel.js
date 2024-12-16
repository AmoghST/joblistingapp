import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css'; // Import the CSS file

const API_BASE_URL = 'http://localhost:5000'; // Replace with your backend API base URL

// Admin Panel Component
const AdminPanel = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [jobs, setJobs] = useState([]);

  // Fetch existing job listings
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/jobs`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Add new job listing
  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/admin/jobs`, {
        jobTitle,
        description,
        location,
        salary,
        contactEmail,
      });
      fetchJobs(); // Refresh job list
      setJobTitle('');
      setDescription('');
      setLocation('');
      setSalary('');
      setContactEmail('');
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  return (
    <div className="admin-panel">
      <h2 className="header">Admin Panel</h2>
      <form onSubmit={handleAddJob} className="job-form">
        <input 
          type="text" 
          placeholder="Job Title" 
          value={jobTitle} 
          onChange={(e) => setJobTitle(e.target.value)} 
          required 
          className="input-field"
        />
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
          className="input-field"
        />
        <input 
          type="text" 
          placeholder="Location" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          required 
          className="input-field"
        />
        <input 
          type="number" 
          placeholder="Salary" 
          value={salary} 
          onChange={(e) => setSalary(e.target.value)} 
          required 
          className="input-field"
        />
        <input 
          type="email" 
          placeholder="Contact Email" 
          value={contactEmail} 
          onChange={(e) => setContactEmail(e.target.value)} 
          required 
          className="input-field"
        />
        <button type="submit" className="submit-btn">Add Job</button>
      </form>

      <h3 className="job-list-header">Job Listings</h3>
      <table className="job-list-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Description</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Contact Email</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.jobTitle}</td>
              <td>{job.description}</td>
              <td>{job.location}</td>
              <td>{job.salary}</td>
              <td>{job.contactEmail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
