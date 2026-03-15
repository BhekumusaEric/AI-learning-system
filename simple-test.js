const http = require('http');

console.log('Testing simple API call...');

const req = http.get('http://localhost:3001/api/content/grounds', (res) => {
  console.log(`Status: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Response:', data.substring(0, 200));
    console.log('✅ Success!');
  });
});

req.on('error', (err) => {
  console.log('❌ Error:', err.message);
});

req.setTimeout(5000, () => {
  console.log('❌ Timeout');
  req.destroy();
});