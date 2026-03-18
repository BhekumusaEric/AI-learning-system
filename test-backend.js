#!/usr/bin/env node

// Simple test script to verify backend API connectivity
const http = require('http');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing SAAIO Training Grounds Backend API...\n');

  // Test 1: Auth Login
  console.log('1. Testing Auth Login...');
  try {
    const loginResponse = await makeRequest('/api/auth/login', 'POST', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ Auth Login: SUCCESS');
    console.log('   Response:', JSON.parse(loginResponse).user?.email);
  } catch (error) {
    console.log('❌ Auth Login: FAILED');
    console.log('   Error:', error.message);
  }

  // Test 2: Get Grounds
  console.log('\n2. Testing Get Grounds...');
  try {
    const groundsResponse = await makeRequest('/api/content/grounds');
    const grounds = JSON.parse(groundsResponse);
    console.log('✅ Get Grounds: SUCCESS');
    console.log(`   Found ${grounds.length} learning grounds`);
    grounds.slice(0, 2).forEach(ground => {
      console.log(`   - ${ground.emoji} ${ground.title} (${ground.difficulty})`);
    });
  } catch (error) {
    console.log('❌ Get Grounds: FAILED');
    console.log('   Error:', error.message);
  }

  // Test 3: Get Ground Content
  console.log('\n3. Testing Get Ground Content...');
  try {
    const contentResponse = await makeRequest('/api/content/ground/python-fundamentals?groundId=python-fundamentals');
    const content = JSON.parse(contentResponse);
    console.log('✅ Get Ground Content: SUCCESS');
    console.log(`   Found ${content.length} content items`);
    content.slice(0, 2).forEach(item => {
      console.log(`   - ${item.title} (${item.type})`);
    });
  } catch (error) {
    console.log('❌ Get Ground Content: FAILED');
    console.log('   Error:', error.message);
  }

  // Test 4: Get Content Item
  console.log('\n4. Testing Get Content Item...');
  try {
    const itemResponse = await makeRequest('/api/content/item/python-intro?contentId=python-intro');
    const item = JSON.parse(itemResponse);
    console.log('✅ Get Content Item: SUCCESS');
    console.log(`   Title: ${item.title}`);
    console.log(`   Type: ${item.type}`);
    console.log(`   Content length: ${item.content.length} characters`);
  } catch (error) {
    console.log('❌ Get Content Item: FAILED');
    console.log('   Error:', error.message);
  }

  // Test 5: Progress API
  console.log('\n5. Testing Progress API...');
  try {
    const progressResponse = await makeRequest('/api/progress');
    const progress = JSON.parse(progressResponse);
    console.log('✅ Progress API: SUCCESS');
    console.log(`   Progress items: ${Array.isArray(progress) ? progress.length : 'N/A'}`);
  } catch (error) {
    console.log('❌ Progress API: FAILED');
    console.log('   Error:', error.message);
  }

  console.log('\n🎉 API Testing Complete!');
  console.log('\n💡 The mobile app should now be able to connect to this backend.');
  console.log('   Make sure to start the mobile app with: cd mobile-app && npx expo start');
}

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = BASE_URL + path;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Run the test
testAPI().catch(console.error);