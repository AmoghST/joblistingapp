const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

let jobs = [
  // Example job listings
  {
    id: 1,
    jobTitle: 'Software Engineer',
    description: 'Develop and maintain web applications.',
    location: 'New York, NY',
    salary: 80000,
    contactEmail: 'hr@company.com',
  },
  {
    id: 2,
    jobTitle: 'Product Manager',
    description: 'Lead product strategy and development.',
    location: 'San Francisco, CA',
    salary: 95000,
    contactEmail: 'hr@company.com',
  },
];

let applications = [];

// Admin Routes
// Get all job listings
app.get('/admin/jobs', (req, res) => {
  res.json(jobs);
});

// Add a new job listing
app.post('/admin/jobs', (req, res) => {
  const { jobTitle, description, location, salary, contactEmail } = req.body;
  const newJob = {
    id: jobs.length + 1, // Incremental job ID
    jobTitle,
    description,
    location,
    salary,
    contactEmail,
  };
  jobs.push(newJob);
  res.status(201).json(newJob);
});

// Candidate Routes
// Get all available jobs
app.get('/candidate/jobs', (req, res) => {
  res.json(jobs);
});

// Apply for a job
app.post('/candidate/apply', (req, res) => {
  const { candidateName, contact, jobId } = req.body;
  const job = jobs.find((job) => job.id === jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const application = {
    id: applications.length + 1,
    candidateName,
    contact,
    jobId,
    jobTitle: job.jobTitle,
    location: job.location,
  };

  applications.push(application);
  res.status(201).json({ message: 'Application submitted successfully', application });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
