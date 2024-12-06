const API_KEY = import.meta.env.VITE_GROK_API_KEY;
const API_URL = 'https://api.grok.cloud/v1/chat/completions';

export async function sendMessage(message) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: message }],
        model: 'grok-1',
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response from Grok');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}