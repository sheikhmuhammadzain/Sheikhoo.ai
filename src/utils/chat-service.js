import groq from './groq-client';

export async function sendChatMessage(message) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful and knowledgeable AI assistant. Provide clear, accurate, and engaging responses."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error('Error in chat service:', error);
    throw new Error('Failed to get response from Groq');
  }
}