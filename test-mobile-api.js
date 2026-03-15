const http = require('http');

console.log('🧪 Testing Mobile App API Server...\n');

const BASE_URL = 'http://localhost:3001';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = BASE_URL + path;
    console.log(`Making request to: ${method} ${url}`);

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      console.log(`Response status: ${res.statusCode}`);
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        console.log(`Response body length: ${body.length}`);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      console.log(`Request error: ${error.message}`);
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testAPI() {
  try {
    // Test 1: Get Grounds
    console.log('1. Testing Get Grounds...');
    const groundsResponse = await makeRequest('/api/content/grounds');
    const grounds = JSON.parse(groundsResponse);
    console.log('✅ Get Grounds: SUCCESS');
    console.log(`   Found ${grounds.length} learning grounds:`);
    grounds.forEach(ground => {
      console.log(`   - ${ground.emoji} ${ground.title} (${ground.difficulty})`);
    });

    console.log('\n🎉 API test passed!');
    console.log('\n📱 Mobile app should now connect successfully!');

  } catch (error) {
    console.log('❌ API Test failed:');
    console.log('   Error:', error.message);
    console.log('\n🔧 Make sure the API server is running:');
    console.log('   node mobile-api-server.js');
  }
}

testAPI();