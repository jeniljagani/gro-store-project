const { GoogleGenerativeAI } = require('@google/generative-ai');

// Lazy initialization
let genAI = null;
const getModel = () => {
    if (!genAI && process.env.GEMINI_API_KEY) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return genAI ? genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' }) : null;
};

const SYSTEM_PROMPT = `You are Chef AI, a premium culinary assistant for FreshGo — an elite organic grocery platform.

Your personality:
- Warm, knowledgeable, and enthusiastic about food
- You speak with confidence and passion like a Michelin-star chef
- You give concise, actionable advice
- You occasionally use food emojis to add personality

Your capabilities:
- Suggest recipes based on ingredients or dietary preferences
- Recommend grocery items and meal plans
- Provide cooking tips, techniques, and substitutions
- Help with nutritional information
- Suggest food pairings and seasonal ingredients

Keep responses concise (2-4 paragraphs max). Always be helpful and inspiring.`;

// @desc    Chat with AI assistant
// @route   POST /api/chat
exports.chatWithAI = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ message: 'Messages array is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                message: 'Gemini API key not configured. Add GEMINI_API_KEY to your .env file.',
                reply: "I'm currently offline — my AI brain needs an API key to work! Please ask the administrator to configure the Gemini API key. 🔧"
            });
        }

        const model = getModel();
        if (!model) {
            return res.status(500).json({
                reply: "I'm currently offline — my AI brain needs a valid API key to work! 🔧"
            });
        }

        // Convert messages to Gemini format
        const history = messages.slice(0, -1).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        const lastMessage = messages[messages.length - 1].content;

        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
                { role: 'model', parts: [{ text: "Understood. I am Chef AI, your premium culinary assistant. How can I help you today?" }] },
                ...history
            ],
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        const reply = response.text();

        res.json({ reply });

    } catch (error) {
        console.error('Gemini Error:', error.message);

        if (error.message.includes('API key not valid')) {
            return res.status(401).json({
                reply: "My API key seems to be invalid. Please check the GEMINI_API_KEY in your .env file. 🔑"
            });
        }

        if (error.message.includes('quota')) {
            return res.status(429).json({
                reply: "I've used up my API quota for now. Please try again later. ⏳"
            });
        }

        res.status(500).json({
            reply: "Something went wrong on my end. Please try again in a moment! 🍳"
        });
    }
};
