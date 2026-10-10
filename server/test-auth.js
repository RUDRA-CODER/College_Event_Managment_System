
const API = 'http://localhost:5000/api';

async function testAuth() {
    console.log('Testing authentication...');
    
    // 1. Try to fetch protected registrations without auth
    const regRes = await fetch(`${API}/registrations/me`);
    console.log('GET /registrations/me without auth:', regRes.status); // Should be 401
    
    // 2. Login as admin
    const adminLogin = await fetch(`${API}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@ckpcet.ac.in', password: 'password123' })
    });
    const adminData = await adminLogin.json();
    console.log('Admin login success:', adminData.success);
    const adminToken = adminData.data?.token;
    
    if (adminToken) {
        // Create event
        const createEventRes = await fetch(`${API}/events`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                title: 'Test Event Auth',
                description: 'Test desc',
                category: 'Technical',
                date: '2026-10-10',
                time: '10:00 AM',
                venue: 'Lab',
                image: 'img',
                registrationDeadline: '2026-10-01',
                maxParticipants: 100,
                coordinatorIds: []
            })
        });
        console.log('Admin create event status:', createEventRes.status); // Should be 201
    }
    
    console.log('Auth testing complete.');
}

testAuth();
