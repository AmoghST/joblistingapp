const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./DBconnection'); 
const { Configuration, OpenAIApi } = require("openai");
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL database!');
    connection.release(); 
  }
});


// Get all job listings
app.get('/admin/jobs', (req, res) => {
  pool.query('SELECT * FROM jobs', (err, results) => {
    if (err) {
      console.error('Error fetching jobs:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
});

// Add a new job listing
app.post('/admin/jobs', (req, res) => {
  const { jobTitle, description, location, salary, contactEmail } = req.body;

  // Validate inputs
  if (!jobTitle || !description || !location || !salary || !contactEmail) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const salaryNumber = parseFloat(salary);
  if (isNaN(salaryNumber)) {
    return res.status(400).json({ error: 'Invalid salary value' });
  }

  const sql = `
    INSERT INTO jobs (jobTitle, description, location, salary, contactEmail)
    VALUES (?, ?, ?, ?, ?)
  `;

  pool.query(
    sql,
    [jobTitle, description, location, salaryNumber, contactEmail],
    (err, results) => {
      if (err) {
        console.error('Error inserting job:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }

      const newJob = {
        id: results.insertId, 
        jobTitle,
        description,
        location,
        salary: salaryNumber,
        contactEmail,
      };

      res.status(201).json(newJob);
    }
  );
});

//apply for job
app.post('/candidate/apply', (req, res) => {
  const {jobId, candidateName,contact } = req.body;

  // Validate inputs
  if (!candidateName || !contact || !jobId) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = `
    INSERT INTO job_applications (jobId, candidateName, contact)
    VALUES (?, ?, ?)
  `;

  pool.query(
    sql,
    [jobId, candidateName, contact],
    (err, results) => {
      if (err) {
        console.error('Error inserting job:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }

      const newJob = {
        jobId: jobId, 
        candidateName,
        contact
      };

      res.status(201).json(newJob);
    }
  );
});


// Get all available jobs
app.get('/candidate/jobs', (req, res) => {
  pool.query('SELECT * FROM jobs', (err, results) => {
    if (err) {
      console.error('Error fetching jobs:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json(results);
  });
});

const openai = new OpenAI({
  apiKey:process.env.OPEN_AI_KEY
});

//this is the middleware 
//in this middleware i fetched the all jobs and send this all job as a requiest body
const fetchJobsMiddleware = (req, res, next) => {
  pool.query('SELECT * FROM jobs', (err, results) => {
      if (err) {
          console.error('Error fetching jobs:', err.message);
          return res.status(500).json({ error: 'Database error' });
      }
      req.jobs = results; 
      next();
  });
};

// Endpoint to interact with ChatGPT
app.post("/candidate/chat",fetchJobsMiddleware, async (req, res) => {
  const { userQuery} = req.body;

  try {
    // Build the ChatGPT prompt
    let prompt = `You are a job recommendation assistant. `;

    if (userQuery.toLowerCase().includes("looking for")) {
      prompt += `Suggest jobs based on this input: "${userQuery}". Here are some jobs: ${JSON.stringify( req.jobs)}.`;
    } else if (userQuery.toLowerCase().includes("job id")) {
      const jobId = userQuery.match(/\d+/)?.[0]; // Extract job ID from the query
      const job =  req.jobs.find((j) => j.id === parseInt(jobId));
      if (job) {
        prompt += `Provide detailed information about this job: ${JSON.stringify(job)}.`;
      } else {
        prompt += `The user asked about Job ID ${jobId}, but no such job exists.`;
      }
    } else {
      prompt += `Respond to the user's query in a helpful manner: "${userQuery}".`;
    }

   
    const response = openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {"role": "user", "content": "write a haiku about ai"},
      ],
    });

    // Extract and return the response
    const chatResponse = response.choices[0].message.content;
    res.json({ response: chatResponse });

  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    res.status(500).json({ error: "Failed to process the query." });
  }
});

// Endpoint to search jobs
app.post('/search-jobs', (req, res) => {
    const userQuery = req.body.query;

    if (!userQuery) {
        return res.status(400).send({ error: 'Query is required' });
    }
    console.log('Received query:', userQuery);

    // Extract keywords (simple example, refine for production use)
    const keywords = userQuery.toLowerCase().split(' ');
    console.log('Extracted keywords:', keywords);
    const jobTitleKeyword = keywords.find(word => word === 'engineer' || word === 'scientist' || word === 'data analyst');
    console.log('Job Title Keyword:', jobTitleKeyword);
    const locationKeyword = keywords.find(word => word === 'mumbai' || word === 'pune');
    console.log('Location Keyword:', locationKeyword);

    // Build the SQL query
    const sql = `
        SELECT * 
        FROM jobs
        WHERE 
            jobTitle LIKE ? 
            AND location LIKE ?
    `;

    pool.query(sql, [`%${jobTitleKeyword}%`, `%${locationKeyword}%`], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).send({ error: 'Database query failed' });
        }

        res.send({ jobs: results });
        console.log('Jobs found:', results);
    });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
