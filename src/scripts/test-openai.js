require('dotenv').config({ path: '.env.local' });
const { OpenAI } = require('openai');

async function testOpenAI() {
  try {
    console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
    console.log('First few characters of API key:', process.env.OPENAI_API_KEY?.substring(0, 5) + '...');
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    console.log('Attempting to call OpenAI API...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Give a one-sentence response about beauty products." }
      ],
    });
    
    console.log('OpenAI API Response:', response.choices[0].message.content);
    console.log('API call successful!');
    return true;
  } catch (error) {
    console.error('Error testing OpenAI API:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

testOpenAI()
  .then(success => {
    console.log('Test completed with ' + (success ? 'success!' : 'failure.'));
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error during test:', err);
    process.exit(1);
  }); 