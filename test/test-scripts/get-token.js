// get-token.js
const axios = require('axios');

async function getToken() {
  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      username: 'your_username',
      password: 'your_password'
    });
    
    console.log('Your JWT token for testing:');
    console.log(response.data.accessToken);
  } catch (error) {
    console.error('Error getting token:', error.response?.data || error.message);
  }
}

getToken();
