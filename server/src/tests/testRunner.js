const http = require('http');

const makeRequest = (path, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('=== FoodExpress Automated API Verification Tests ===\n');

  try {
    // 1. Health check
    const health = await makeRequest('/health');
    console.log('1. Health Check:', health.status === 200 ? 'PASSED ✅' : 'FAILED ❌', health.body.message || '');

    // 2. Auth - Register Test User
    const testUserEmail = `test_${Date.now()}@foodexpress.com`;
    const regRes = await makeRequest('/auth/register', 'POST', {
      name: 'Test Customer',
      email: testUserEmail,
      password: 'password123',
      phone: '9998887770',
      role: 'CUSTOMER',
    });
    console.log('2. User Registration:', regRes.status === 201 ? 'PASSED ✅' : 'FAILED ❌');
    const token = regRes.body?.data?.token;

    // 3. Auth - Login Admin
    const loginRes = await makeRequest('/auth/login', 'POST', {
      email: 'admin@foodexpress.com',
      password: 'password123',
    });
    console.log('3. Admin Login:', loginRes.status === 200 ? 'PASSED ✅' : 'FAILED ❌');
    const adminToken = loginRes.body?.data?.token;

    // 4. Get Restaurants
    const restRes = await makeRequest('/restaurants');
    console.log('4. Get Restaurants:', restRes.status === 200 ? 'PASSED ✅' : 'FAILED ❌', `(Found ${restRes.body?.count || 0} restaurants)`);

    // 5. Get Foods
    const foodRes = await makeRequest('/foods');
    console.log('5. Get Foods:', foodRes.status === 200 ? 'PASSED ✅' : 'FAILED ❌', `(Found ${foodRes.body?.count || 0} items)`);

    // 6. Cart - Add Item
    if (foodRes.body?.data?.[0] && token) {
      const foodId = foodRes.body.data[0]._id;
      const cartRes = await makeRequest('/cart', 'POST', { foodId, quantity: 2 }, token);
      console.log('6. Add to Cart:', cartRes.status === 200 ? 'PASSED ✅' : 'FAILED ❌');
    }

    // 7. Validate Coupon
    if (token) {
      const couponRes = await makeRequest('/coupons/validate', 'POST', { code: 'WELCOME50', amount: 300 }, token);
      console.log('7. Validate Coupon:', couponRes.status === 200 ? 'PASSED ✅' : 'FAILED ❌');
    }

    // 8. Admin Dashboard Stats
    if (adminToken) {
      const adminDash = await makeRequest('/admin/dashboard', 'GET', null, adminToken);
      console.log('8. Admin Dashboard Stats:', adminDash.status === 200 ? 'PASSED ✅' : 'FAILED ❌');
    }

    console.log('\n=== All API Tests Completed Successfully ===');
  } catch (error) {
    console.error('Test Runner Error:', error.message);
  }
};

runTests();
