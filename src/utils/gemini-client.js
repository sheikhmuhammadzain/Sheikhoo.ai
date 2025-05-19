import { GoogleGenerativeAI } from "@google/generative-ai";

function checkEnvironmentVariables() {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error(
      "VITE_GEMINI_API_KEY is not defined in environment variables.\n" +
      "Please follow these steps:\n" +
      "1. Copy .env.example to .env\n" +
      "2. Add your Gemini API key to the .env file\n" +
      "3. Restart the development server"
    );
  }
}

// Check environment variables before initializing
checkEnvironmentVariables();

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Get the model
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-04-17",
  generationConfig: {
    temperature: 0.7,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  },
});

// Helper function to convert file to base64 (for image/file support)
export async function fileToGenerativePart(file) {
  const data = await file.arrayBuffer();
  return {
    inlineData: {
      data: Buffer.from(data).toString('base64'),
      mimeType: file.type
    },
  };
}

export default model;
