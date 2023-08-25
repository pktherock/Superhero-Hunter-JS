let baseUrl = '';
let publicKey = '';
let privateKey = '';

async function loadApiKey() {
  try {
    const response = await fetch('api-key.json'); // Path to your JSON file
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading API key:', error);
    return null;
  }
}

async function main() {
  const { BASE_URL, PUBLIC_KEY, PRIVATE_KEY } = await loadApiKey();
  if (BASE_URL && PUBLIC_KEY && PRIVATE_KEY) {
    // Use the API key in your code
    console.log('Base URL:', BASE_URL);
    console.log('Public Key:', PUBLIC_KEY);
    console.log('Private Key:', PRIVATE_KEY);
    baseUrl = BASE_URL;
    publicKey = PUBLIC_KEY;
    privateKey = PRIVATE_KEY;
  } else {
    // Handle error or fallback
    console.error('API key not available.');
  }
}

main();
