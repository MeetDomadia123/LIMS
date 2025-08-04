import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function runAllTests() {
  console.log('🚀 Starting LIMS Quick Tests...\n');

  // Test 1: Health Check
  console.log('1. Health Check...');
  try {
    const health = await fetch(`${API_BASE}/health`);
    const healthData = await health.json();
    console.log('✅ Server is running:', healthData.status);
  } catch (error) {
    console.log('❌ Server health check failed');
    return;
  }

  // Test 2: Metrics
  console.log('\n2. Testing Metrics...');
  try {
    const metrics = await fetch(`${API_BASE}/metrics/simple`);
    const metricsData = await metrics.json();
    console.log('✅ Metrics working:', metricsData[0]);
  } catch (error) {
    console.log('❌ Metrics test failed');
  }

  // Test 3: Comprehensive Metrics
  console.log('\n3. Testing Comprehensive Metrics...');
  try {
    const comprehensive = await fetch(`${API_BASE}/metrics/comprehensive`);
    const comprehensiveData = await comprehensive.json();
    console.log('✅ Comprehensive metrics working:', comprehensiveData.summary);
  } catch (error) {
    console.log('❌ Comprehensive metrics test failed');
  }

  // Test 4: Chatbot (without auth)
  console.log('\n4. Testing Chatbot...');
  try {
    const chatbot = await fetch(`${API_BASE}/chatbot/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: "What is the current stock?",
        userId: 1
      })
    });
    const chatbotData = await chatbot.json();
    console.log('✅ Chatbot working:', chatbotData.response?.substring(0, 50) + '...');
  } catch (error) {
    console.log('❌ Chatbot test failed');
  }

  console.log('\n🎉 All tests completed!');
}

runAllTests();