import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AdminPanel = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [jobs, setJobs] = useState([]);

  const API_BASE_URL = 'http://localhost:5000';

  // Fetch existing job listings
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/jobs`);
      setJobs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const showToast = () => {
    toast.success('Job added successfully!');
  };  

  // Add new job listing
  const handleAddJob = async (e) => {
    e.preventDefault();

    const salaryValue = parseFloat(salary);
    if (isNaN(salaryValue)) {
      alert('Please enter a valid salary.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/admin/jobs`, {
        jobTitle,
        description,
        location,
        salary: salaryValue,
        contactEmail,
      });

      fetchJobs(); 
      setJobTitle('');
      setDescription('');
      setLocation('');
      setSalary('');
      setContactEmail('');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error adding job. Please try again.');
    }
  };

  return (
    <div className="admin-panel">
      <h4 className='topheading'>Job Listing and Application Portal</h4>
        <form onSubmit={handleAddJob} className="job-form">
        <h2 className="header">Admin Panel</h2>

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
        <button type="submit" onClick={showToast} className="submit-btn">Add Job</button>
        <ToastContainer /> 
      </form>

      <h3 className="job-list-header">Job Listings</h3>
      <table className="job-list-table">
        <thead>
          <tr className='tablerow'>
            <th>Job Title</th>
            <th>Description</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Contact Email</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(jobs) &&
            jobs.map((job) => (
              <tr className='tablerow' key={job.id}>
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
