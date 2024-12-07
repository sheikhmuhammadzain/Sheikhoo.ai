# StudyBuddy.ai

Your AI-powered study companion built with React, Vite, and Google's Gemini AI.

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/your-username/studybuddy-ai.git
cd studybuddy-ai
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API key
# Get your API key from https://makersuite.google.com/app/apikey
```

4. Add your Gemini API key to the `.env` file:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

5. Start the development server
```bash
npm run dev
```

## Features
- Modern, minimal UI with glass morphism design
- Powered by Google's Gemini AI
- Real-time chat interface
- Markdown support for messages
- Responsive design

## Technologies Used
- React
- Vite
- Tailwind CSS
- Framer Motion
- Google Generative AI
- React Markdown

## Environment Variables

The following environment variables are required:

| Variable | Description |
|----------|-------------|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key |

## Security Notes
- Never commit your `.env` file to version control
- Keep your API keys secure and rotate them regularly
- Use environment variables for all sensitive data
