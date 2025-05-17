// test-websocket.js
const { io } = require('socket.io-client');
const axios = require('axios');

async function testWebSocketConnection() {
  try {
    // First, get a valid token by logging in
    console.log('Logging in to get token...');
    const authResponse = await axios.post('http://localhost:3000/v1/auth/login', {
      username: 'gassssouma1',
      password: 'gassouma123'
    });
    
    const token = authResponse.data.accessToken;
    console.log('Token received:', token);
    
    // Connect to the WebSocket with the token
    console.log('Connecting to WebSocket...');
    const socket = io('http://localhost:3000/messages', {
      auth: {
        token: token
      },
      transports: ['websocket']
    });
    
    // Handle connection events
    socket.on('connect', () => {
      console.log('Connected to WebSocket server!');
      
      // Send a test message
      console.log('Sending test message...');
      socket.emit('send_message', {
        receiverUsername: 'gassssouma2',
        content: 'Hello from test gassouma1!'
      });
    });
    
    // Handle message responses
    socket.on('message_sent', (data) => {
      console.log('Message sent confirmation:', data);
    });
    
    socket.on('receive_message', (message) => {
      console.log('Received message:', message);
    });
    
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
    
    // Keep the connection alive for testing
    setTimeout(() => {
      socket.disconnect();
      console.log('Test completed, connection closed');
    }, 10000);
    
  } catch (error) {
    console.error('Error in test:', error.response?.data || error.message);
  }
}

testWebSocketConnection();
