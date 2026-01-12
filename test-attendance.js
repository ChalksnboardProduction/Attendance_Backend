const axios = require('axios');

const BASE_URL = 'http://localhost:8000';
const TARGET_COORD = { latitude: 28.4595, longitude: 77.0266 };
const FAR_COORD = { latitude: 28.4500, longitude: 77.0200 };

async function runTests() {
    try {
        // 1. Register Employee
        console.log('--- Registering Employee ---');
        const empPhone = `9876543210${Math.floor(Math.random() * 100)}`;
        const empRes = await axios.post(`${BASE_URL}/user`, {
            name: 'John Doe',
            phone: empPhone,
            password: 'password123',
            role: 'EMPLOYEE'
        });
        console.log('Employee Registered:', empRes.data.user.id);

        // 2. Login Employee
        console.log('\n--- Login Employee ---');
        const loginRes = await axios.post(`${BASE_URL}/user/login`, {
            phone: empPhone,
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Login Successful, Token received');

        // 3. Check-in Check (Far)
        console.log('\n--- Attempting Check-in (Far Away) ---');
        try {
            await axios.post(`${BASE_URL}/attendance/check-in`, FAR_COORD, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.log('Checked-in blocked correctly:', err.response.data.error);
        }

        // 4. Check-in Check (Near)
        console.log('\n--- Attempting Check-in (Near) ---');
        const checkInRes = await axios.post(`${BASE_URL}/attendance/check-in`, TARGET_COORD, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Check-in Successful:', checkInRes.data.message);

        // 5. Duplicate Check-in
        console.log('\n--- Attempting Duplicate Check-in ---');
        try {
            await axios.post(`${BASE_URL}/attendance/check-in`, TARGET_COORD, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (err) {
            console.log('Duplicate check-in blocked:', err.response.data.error);
        }

        // 6. Check-out
        console.log('\n--- Attempting Check-out ---');
        const checkOutRes = await axios.post(`${BASE_URL}/attendance/check-out`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Check-out Successful:', checkOutRes.data.message);

        // 7. Get Attendance
        console.log('\n--- Fetching Attendance ---');
        const finalRes = await axios.get(`${BASE_URL}/attendance`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Attendance Records:', finalRes.data.length);

    } catch (err) {
        console.error('Test Failed:', err.response ? err.response.data : err.message);
    }
}

runTests();
