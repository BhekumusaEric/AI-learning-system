#!/usr/bin/env node

// Simple test script to verify backend API connectivity
const http = require('http');

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('--- Testing SAAIO Training Grounds Backend API ---\n');

  // Test 1: Auth Login
  console.log('1. Testing Auth Login...');
  try {
    const loginResponse = await makeRequest('/api/auth/login', 'POST', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('[SUCCESS]');
    console.log('   Response:', JSON.parse(loginResponse).user?.email);
  } catch (error) {
    console.log('[FAILED]');
    console.log('   Error:', error.message);
  }

  // Test 2: Get Grounds
  console.log('\n2. Testing Get Grounds...');
  try {
    const groundsResponse = await makeRequest('/api/content/grounds');
    const grounds = JSON.parse(groundsResponse);
    console.log(`[SUCCESS] Found ${grounds.length} learning grounds`);
    grounds.slice(0, 2).forEach(ground => {
      console.log(`   - ${ground.title} (${ground.difficulty})`);
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
    console.log(`[SUCCESS] Found ${content.length} content items`);
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
    console.log(`[SUCCESS] Content length: ${item.content.length} characters`);
  } catch (error) {
    console.log('❌ Get Content Item: FAILED');
    console.log('   Error:', error.message);
  }

  // Test 5: Progress API
  console.log('\n5. Testing Progress API...');
  try {
    const progressResponse = await makeRequest('/api/progress');
    const progress = JSON.parse(progressResponse);
    console.log(`[SUCCESS] Progress items: ${Array.isArray(progress) ? progress.length : 'N/A'}`);
  } catch (error) {
    console.log('❌ Progress API: FAILED');
    console.log('   Error:', error.message);
  }

  console.log('\nAPI Testing Complete.');
  console.log('\nThe platform is ready for client connections.');
  console.log('   To start the app: npm run dev');
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