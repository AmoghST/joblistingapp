import React, { useState } from 'react';
import axios from 'axios';
import './DummyBot.css';

function DummyBot() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const searchJobs = async () => {
        if (!query.trim()) return; // Don't search if the query is empty

        setLoading(true);
        setError(''); // Reset any previous error

        try {
            const response = await axios.post('http://localhost:5000/search-jobs', {
                query,
            });
            setResults(response.data.jobs);
        } catch (error) {
            console.error('Error searching jobs:', error);
            setError('An error occurred while fetching the jobs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <h1>Job Seeker Bot</h1>
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Enter your job query..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={searchJobs}>Search Jobs</button>
            </div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="results">
                {results.length > 0 ? (
                    results.map((job, index) => (
                        <div key={index} className="job-card">
                            <h3>{job.jobTitle}</h3>
                            <p>{job.description}</p>
                            <p><strong>Location:</strong> {job.location}</p>
                            <p><strong>Salary:</strong> {job.salary}</p>
                            <p><strong>Contact:</strong> {job.contactEmail}</p>
                        </div>
                    ))
                ) : (
                    <p>No jobs found.</p>
                )}
            </div>
        </div>
    );
}

export default DummyBot;
