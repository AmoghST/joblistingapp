import React, { useState } from 'react';
import axios from 'axios';
import './Chatbot.css'; // Optional: Add custom styling

const Chatbot = () => {
  const [userQuery, setUserQuery] = useState(''); // User's query
  const [response, setResponse] = useState(''); // ChatGPT's response
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Function to handle form submission
  const handleQuerySubmit = async (e) => {
    e.preventDefault();

    if (!userQuery.trim()) {
      alert('Please enter a query.');
      return;
    }

    setIsLoading(true);
    setResponse(''); // Clear previous response

    try {
      const res = await axios.post('http://localhost:5000/candidate/chat', { userQuery }); // Adjust backend URL
      setResponse(res.data.response); // Update response
    } catch (error) {
      console.error('Error fetching response:', error.message);
      setResponse('Sorry, something went wrong. Please try again.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="chat-bot">
      <h2>Job ChatBot</h2>
      <form onSubmit={handleQuerySubmit}>
        <textarea
          placeholder="Type your query here (e.g., 'I’m looking for a software developer job in Mumbai')"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          rows="4"
          className="query-input"
        ></textarea>
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Send'}
        </button>
      </form>
      {response && (
        <div className="response-box">
          <h4>Response:</h4>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
