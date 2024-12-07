import model from './gemini-client';

export async function sendChatMessage(message) {
  try {
    // Generate content using the model directly
    const result = await model.generateContent(message);
    
    // Wait for the response
    const response = await result.response;
    
    // Get the text from the response
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error in chat service:', error);
    throw new Error('Failed to get response from Gemini');
  }
}