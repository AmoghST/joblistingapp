import React, { useState,useRef, useEffect } from 'react';
import axios from 'axios';
import './CandidatePortal.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CandidatePortal = () => {
  const [jobs, setJobs] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchJobtitle ,setSearchJobtitle] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [contact, setContact] = useState('');
  const [jobId, setJobId] = useState('');


  // Fetch available jobs
  const fetchJobs = async () => {
    console.log(typeof jobs);
    try {
      const response = await axios.get("http://localhost:5000/candidate/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

 
  const ref = useRef(null);
  // Apply for a job
  const handleApply = async (e) => {
    e.preventDefault();
    ref.current.click();
   
    
    
    try {
      await axios.post("http://localhost:5000/candidate/apply", {
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
      <div className="container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
         <input
          type="text"
          className="search-input"
          placeholder="Search by JobTitle"
          value={searchJobtitle}
          onChange={(e) => setSearchJobtitle(e.target.value)}
        />
      </div>

      <h3 className="job-list-header">Available Jobs</h3>
      <div className="row my-3">
        {jobs
          .filter((job) =>
            job.location.toLowerCase().includes(searchLocation.toLowerCase())
          )
          .filter((job) =>
            job.jobTitle.toLowerCase().includes(searchJobtitle.toLowerCase())
        )
        
          .map((job) => (
            <div className="col-md-4" key={job.id}>
              <div className="card my-3">
                <div className="card-body">
                  <h5 className="card-title">{job.jobTitle}</h5>
                  <p className="card-text">
                    {job.location} {job.salary}
                  </p>
                  <p className="card-text">{job.description}</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => setJobId(job.id)} // Set jobId here
                  >
                    Apply
                  </button>
                </div>
            <ToastContainer />

              </div>
             
            </div>
          ))}
      </div>



<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      
      <div class="modal-body">
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
                  <button type="submit" className="submit-btn">
                    Submit Application
                  </button>
                  
                </form>
              )}      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" ref={ref} data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>


    </div>
  );
};

export default CandidatePortal;
