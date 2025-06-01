import { useState, useEffect } from 'react';
import '../styles/showAnalytics.css';
import axios from 'axios';

const PendingApprovals = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) {
        setError('User ID not found.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:7119/api/Message/all-data`);

        if (Array.isArray(response.data) && response.data.length > 0) {
          setMessages(response.data);
          setInfoMessage('');
        } else {
          setMessages([]);
          setInfoMessage('No messages available.');
        }
      } catch (err) {
        console.error(err);
        setMessages([]); 
        setInfoMessage('Failed to load messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  return (
    <div className="admin-approvals-container">
      <h1>Message Analytics</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {infoMessage && <p className="info-message">{infoMessage}</p>}

      {Array.isArray(messages) && messages.length > 0 && (
        <div className="landlords-grid">
          {messages.map((message, index) => (
            <div key={index} className="approval-card">
              <div className="card-header">
                <h3>Message</h3>
              </div>
              <div className="card-body">
                <p><strong>Receiver ID:</strong> {message.receiverId}</p>
                <p><strong>Sender ID:</strong> {message.senderId}</p>
                <p><strong>Content:</strong> {message.content}</p>
                <p><strong>Timestamp:</strong> {new Date(message.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;