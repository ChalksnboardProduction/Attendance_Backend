const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with phone: 2');
    
    const response = await axios.post('http://localhost:8000/user/login', {
      phone: '2'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Test with non-existent phone
async function testLoginFail() {
  try {
    console.log('\nTesting login with non-existent phone: 999');
    
    const response = await axios.post('http://localhost:8000/user/login', {
      phone: '999'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Expected error for non-existent user');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    }
  }
}

// Run tests
testLogin().then(() => {
  testLoginFail();
}); 