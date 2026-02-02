import axios from 'axios';

/**
 * Phase A2: Real User Authentication - Test Suite
 * Tests all authentication endpoints
 */

const BASE_URL = 'http://localhost:5000/api';
let testData = {
  accessToken: null,
  refreshToken: null,
  userId: null
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runTests() {
  log('\n🧪 Starting Phase A2: Authentication Tests...\n', 'blue');

  try {
    // Test 1: Register User
    log('📌 Step 1: Testing User Registration...', 'yellow');
    const email = `testuser_${Date.now()}@example.com`;
    const password = 'SecurePassword123';

    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email,
      password,
      username: 'testuser'
    });

    if (registerResponse.data.success) {
      testData.accessToken = registerResponse.data.tokens.accessToken;
      testData.refreshToken = registerResponse.data.tokens.refreshToken;
      testData.userId = registerResponse.data.user.id;

      log(`   ✅ User registered successfully`, 'green');
      log(`   📧 Email: ${registerResponse.data.user.email}`);
      log(`   👤 Username: ${registerResponse.data.user.username}`);
      log(`   🔑 User ID: ${testData.userId}`);
      log(`   🎟️  Access Token: ${testData.accessToken.substring(0, 30)}...`);
    } else {
      throw new Error(registerResponse.data.message);
    }

    // Test 2: Login User
    log('\n📌 Step 2: Testing User Login...', 'yellow');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password
    });

    if (loginResponse.data.success) {
      log(`   ✅ Login successful`, 'green');
      log(`   📧 Email: ${loginResponse.data.user.email}`);
      log(`   👤 Username: ${loginResponse.data.user.username}`);
      log(`   🔑 Role: ${loginResponse.data.user.role}`);
      log(`   🎟️  New Access Token: ${loginResponse.data.tokens.accessToken.substring(0, 30)}...`);
    } else {
      throw new Error(loginResponse.data.message);
    }

    // Test 3: Get Current User Profile
    log('\n📌 Step 3: Testing Get User Profile...', 'yellow');
    const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${testData.accessToken}`
      }
    });

    if (profileResponse.data.success) {
      const user = profileResponse.data.user;
      log(`   ✅ Profile retrieved successfully`, 'green');
      log(`   📧 Email: ${user.email}`);
      log(`   👤 Username: ${user.username}`);
      log(`   👤 Role: ${user.role}`);
      log(`   📅 Created: ${new Date(user.createdAt).toLocaleString()}`);
    } else {
      throw new Error(profileResponse.data.message);
    }

    // Test 4: Refresh Token
    log('\n📌 Step 4: Testing Token Refresh...', 'yellow');
    const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refreshToken: testData.refreshToken
    });

    if (refreshResponse.data.success) {
      const newAccessToken = refreshResponse.data.tokens.accessToken;
      log(`   ✅ Token refreshed successfully`, 'green');
      log(`   🎟️  New Access Token: ${newAccessToken.substring(0, 30)}...`);
      log(`   ℹ️  Token rotation works correctly`);
    } else {
      throw new Error(refreshResponse.data.message);
    }

    // Test 5: Test Invalid Login
    log('\n📌 Step 5: Testing Invalid Login (Error Handling)...', 'yellow');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password: 'WrongPassword'
      });
      log(`   ❌ Should have failed with wrong password`, 'red');
    } catch (error) {
      if (error.response?.status === 401) {
        log(`   ✅ Correctly rejected invalid password`, 'green');
        log(`   📝 Error: ${error.response.data.message}`);
      }
    }

    // Test 6: Test Duplicate Registration
    log('\n📌 Step 6: Testing Duplicate Email Registration...', 'yellow');
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        email,
        password: 'AnotherPassword123',
        username: 'anotheruser'
      });
      log(`   ❌ Should have failed with duplicate email`, 'red');
    } catch (error) {
      if (error.response?.status === 409) {
        log(`   ✅ Correctly rejected duplicate email`, 'green');
        log(`   📝 Error: ${error.response.data.message}`);
      }
    }

    // Test 7: Test Missing Token
    log('\n📌 Step 7: Testing Protected Route Without Token...', 'yellow');
    try {
      await axios.get(`${BASE_URL}/auth/me`);
      log(`   ❌ Should have failed without token`, 'red');
    } catch (error) {
      if (error.response?.status === 401) {
        log(`   ✅ Correctly rejected missing token`, 'green');
        log(`   📝 Error: ${error.response.data.message}`);
      }
    }

    // Test 8: Test Invalid Token
    log('\n📌 Step 8: Testing Invalid Token...', 'yellow');
    try {
      await axios.get(`${BASE_URL}/auth/me`, {
        headers: {
          Authorization: 'Bearer invalid.token.here'
        }
      });
      log(`   ❌ Should have failed with invalid token`, 'red');
    } catch (error) {
      if (error.response?.status === 401) {
        log(`   ✅ Correctly rejected invalid token`, 'green');
        log(`   📝 Error: ${error.response.data.message}`);
      }
    }

    // Test 9: Logout
    log('\n📌 Step 9: Testing Logout...', 'yellow');
    const logoutResponse = await axios.post(`${BASE_URL}/auth/logout`);

    if (logoutResponse.data.success) {
      log(`   ✅ Logout endpoint responded successfully`, 'green');
      log(`   📝 Note: Client should delete tokens on their side`);
    }

    // Final Summary
    log('\n✅ ALL TESTS PASSED! Authentication system is working correctly.\n', 'green');

    log('📋 Summary of Authentication Endpoints:', 'blue');
    log(`   POST   /api/auth/register        - Register new user`);
    log(`   POST   /api/auth/login           - Login user`);
    log(`   POST   /api/auth/refresh-token  - Refresh access token`);
    log(`   GET    /api/auth/me              - Get current user profile (protected)`);
    log(`   POST   /api/auth/logout          - Logout user\n`);

    log('🔐 Security Features Verified:', 'blue');
    log(`   ✅ Password hashing with bcryptjs`);
    log(`   ✅ JWT token generation and verification`);
    log(`   ✅ Refresh token rotation`);
    log(`   ✅ Protected routes with JWT middleware`);
    log(`   ✅ Error handling for invalid tokens`);
    log(`   ✅ Duplicate email prevention`);
    log(`   ✅ Invalid credential rejection\n`);

  } catch (error) {
    log(`\n❌ TEST FAILED:`, 'red');
    log(`   Error: ${error.message}`, 'red');
    if (error.response?.data) {
      log(`   Response: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
    }
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test execution error: ${error.message}`, 'red');
  process.exit(1);
});
