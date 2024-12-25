import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios'; // Import Axios for API calls

// Socket connection initialization
const socket = io('http://localhost:5000');

const App = () => {
  const [email, setEmail] = useState('harshmistry3172@gmail.com');
  const [isRegistered, setIsRegistered] = useState(false);
  const [socketId, setSocketId] = useState('');
  const [notifications, setNotifications] = useState([]);

  // Register the user with the server and update the socketId
  const handleRegister = async () => {
    setSocketId(socket.id);
    if (email.trim()) {
      try {
        const response = await axios.put(`http://localhost:5000/api/users/${email}/socketId`, {
          socketId: socket.id,
        });

        if (response.status === 200) {
          setIsRegistered(true); // Mark the user as registered
          alert('Successfully registered and socketId updated!');
        }
      } catch (error) {
        console.error('Error registering user:', error);
        alert('Failed to register. Please try again.');
      }
    } else {
      alert('Please enter a valid email address.');
    }
  };

  // Listen for new notifications
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('new-notification', (message) => {
      console.log('New Notification:', message);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        message,
      ]);
    });

    return () => {
      socket.emit('disconnect');
      socket.off('new-notification');
    };
  }, []);

  useEffect(() => {
    if (socketId) {
      console.log('Current Socket ID:', socketId);
    }
  }, [socketId]);

  return (
    <div className="App">
      <h1>Welcome to the In-App Notification System</h1>
      <h3>Socket ID: {socketId}</h3>
      {!isRegistered ? (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleRegister}>Register</button>
        </div>
      ) : (
        <div>
          <h2>Notifications:</h2>
          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>{notification}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
