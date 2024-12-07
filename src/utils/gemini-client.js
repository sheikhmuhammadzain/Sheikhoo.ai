import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCS4RGAtQDFX3fqQ58y9pn_jTcfqqjroQk');

// Get the model
const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
    },
});

export default model;
