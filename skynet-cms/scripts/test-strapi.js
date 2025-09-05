// Test Strapi connection
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

async function testConnection() {
  try {
    console.log('Testing Strapi connection...');
    console.log('URL:', STRAPI_URL);
    
    const response = await fetch(`${STRAPI_URL}/api/services`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Connection successful!');
      console.log('Services found:', data.data.length);
    } else {
      console.log('❌ Connection failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testConnection();