import model, { fileToGenerativePart } from './gemini-client';

// Standard non-streaming message function
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

// Enhanced streaming function with immediate first-chunk response
export async function sendStreamingChatMessage(message, onUpdate) {
  try {
    // Start with an empty response
    let fullResponse = '';
    let lastChunk = '';
    let firstChunkReceived = false;
    
    // Generate content with streaming
    const streamingResult = await model.generateContentStream(message);
    
    // Immediately notify with an empty response to show the AI is working
    if (onUpdate && typeof onUpdate === 'function') {
      onUpdate('');
    }
    
    // Process the stream
    for await (const chunk of streamingResult.stream) {
      try {
        const chunkText = chunk.text() || '';
        lastChunk = chunkText;
        fullResponse += chunkText;
        
        // Call the callback with the updated text so far
        if (onUpdate && typeof onUpdate === 'function') {
          onUpdate(fullResponse);
          
          // If this is the first meaningful chunk, notify immediately
          if (!firstChunkReceived && fullResponse.trim().length > 0) {
            firstChunkReceived = true;
          }
        }
      } catch (err) {
        console.warn('Error processing stream chunk:', err);
        // Continue despite error in a single chunk
      }
    }
    
    // Return the complete response at the end
    return fullResponse;
  } catch (error) {
    console.error('Error in streaming chat service:', error);
    throw new Error('Failed to get streaming response from Gemini');
  }
}

// Function to handle messages with files (including streaming)
export async function sendMultiModalMessage(message, files = [], onUpdate) {
  try {
    let content = [];
    
    // Add text message if provided
    if (message) {
      content.push(message);
    }
    
    // Send an immediate update to show loading state
    if (onUpdate && typeof onUpdate === 'function') {
      onUpdate('');
    }
    
    // Process files if any
    for (const file of files) {
      try {
        if (file.type.startsWith('image/')) {
          // Handle image files
          const imagePart = await fileToGenerativePart(file);
          content.push(imagePart);
        } else if (file.type.startsWith('audio/')) {
          // Handle audio files
          const audioPart = await fileToGenerativePart(file);
          content.push(audioPart);
        } else if (file.type.startsWith('video/')) {
          // Handle video files
          const videoPart = await fileToGenerativePart(file);
          content.push(videoPart);
        } else {
          // Handle other file types as generic files
          const filePart = await fileToGenerativePart(file);
          content.push(filePart);
        }
      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError);
        // Continue with other files if one fails
      }
    }
    
    // If we have onUpdate callback, use streaming
    if (onUpdate && typeof onUpdate === 'function') {
      return sendStreamingChatMessage(content, onUpdate);
    } else {
      // Otherwise use regular response
      const result = await model.generateContent(content);
      const response = await result.response;
      return response.text();
    }
  } catch (error) {
    console.error('Error in multi-modal chat service:', error);
    throw new Error('Failed to process files or get response');
  }
}