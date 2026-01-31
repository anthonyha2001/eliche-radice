const OpenAI = require('openai');

/**
 * AI Assistant service for generating response suggestions
 * and direct customer responses using OpenAI GPT-4
 */

// Initialize OpenAI client (only if API key is available)
let openai = null;
const apiKey = process.env.OPENAI_API_KEY;
// Default to a modern, available model; can be overridden via env
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

if (apiKey && apiKey !== 'placeholder_key') {
  // Validate API key format
  if (!apiKey.startsWith('sk-')) {
    console.warn('⚠️ OpenAI API key format looks invalid (should start with "sk-")');
  }
  
  try {
    openai = new OpenAI({
      apiKey: apiKey,
    });
    console.log(`✅ OpenAI client initialized with model: ${OPENAI_MODEL}`);
    console.log(`   API key: ${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}`);
  } catch (error) {
    console.warn('Failed to initialize OpenAI client:', error.message);
  }
} else {
  console.log('⚠️ OpenAI API key not configured or placeholder used');
  console.log('   Set OPENAI_API_KEY environment variable to enable AI features');
  console.log('   Get your API key from: https://platform.openai.com/api-keys');
}

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are an assistant for Eliche Radice LB, a luxury yacht maintenance company.
Generate 2-3 professional response suggestions for operators to send to yacht owners.
Tone: Calm, confident, professional, reassuring.
Keep responses brief (2-3 sentences max).
Do not use emojis.
Format as JSON array of strings.`;

/**
 * Generate response suggestions based on conversation history
 * @param {Array} conversationHistory - Array of message objects with sender and content
 * @param {string} newMessage - The new message that needs a response
 * @returns {Promise<Array<string>>} Array of response suggestion strings
 */
async function generateSuggestions(conversationHistory, newMessage) {
  try {
    // Check if OpenAI is initialized
    if (!openai) {
      console.warn('OpenAI API key not configured. Returning empty suggestions.');
      return [];
    }

    // Validate inputs
    if (!newMessage || typeof newMessage !== 'string') {
      console.warn('Invalid newMessage provided to generateSuggestions');
      return [];
    }

    if (!Array.isArray(conversationHistory)) {
      conversationHistory = [];
    }

    // Take last 5 messages from history
    const recentMessages = conversationHistory.slice(-5);

    // Build messages array for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Add conversation history
    recentMessages.forEach(msg => {
      if (msg && msg.sender && msg.content) {
        messages.push({
          role: msg.sender === 'customer' ? 'user' : 'assistant',
          content: msg.content,
        });
      }
    });

    // Add the new message
    messages.push({
      role: 'user',
      content: newMessage,
    });

    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('OpenAI API request timeout'));
      }, 10000); // 10 second timeout
    });

    // Make API call with timeout
    const apiCall = openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    const response = await Promise.race([apiCall, timeoutPromise]);

    // Parse the response
    let suggestions = [];
    
    if (response.choices && response.choices[0] && response.choices[0].message) {
      const content = response.choices[0].message.content;
      
      try {
        // Try to parse as JSON
        const parsed = JSON.parse(content);
        
        // Handle different response formats
        if (Array.isArray(parsed)) {
          suggestions = parsed;
        } else if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
          suggestions = parsed.suggestions;
        } else if (typeof parsed === 'object') {
          // Extract array values if it's an object with array values
          const values = Object.values(parsed);
          if (values.length > 0 && Array.isArray(values[0])) {
            suggestions = values[0];
          } else {
            // Try to find any array in the object
            for (const value of values) {
              if (Array.isArray(value)) {
                suggestions = value;
                break;
              }
            }
          }
        } else {
          // If it's a string, try to parse it as JSON again
          try {
            const reParsed = JSON.parse(parsed);
            if (Array.isArray(reParsed)) {
              suggestions = reParsed;
            }
          } catch (e) {
            // Ignore re-parse errors
          }
        }
        
        // Filter to ensure we only return strings
        suggestions = suggestions.filter(s => typeof s === 'string' && s.trim().length > 0);
        
        // Limit to 3 suggestions
        if (suggestions.length > 3) {
          suggestions = suggestions.slice(0, 3);
        }
      } catch (parseError) {
        console.error('Failed to parse OpenAI response as JSON:', parseError);
        // Try to extract suggestions from plain text
        const lines = content.split('\n').filter(line => line.trim().length > 0);
        suggestions = lines.slice(0, 3);
      }
    }

    return suggestions.length > 0 ? suggestions : [];
  } catch (error) {
    // Handle errors gracefully with richer debug info
    const status = error?.status || error?.response?.status;
    const message = error?.message || 'Unknown error';
    const errorCode = error?.code || error?.response?.data?.error?.code;

    if (message === 'OpenAI API request timeout') {
      console.error('❌ OpenAI API request timed out after 10 seconds');
    } else if (status === 401) {
      console.error('❌ OpenAI API authentication failed (401)');
      console.error('   Check OPENAI_API_KEY is correct and not expired');
      console.error('   Get a new key from: https://platform.openai.com/api-keys');
    } else if (status === 429) {
      console.error('❌ OpenAI API rate limit exceeded (429)');
      console.error('   You have exceeded your API rate limit. Please wait before retrying.');
    } else if (status === 404) {
      console.error('❌ OpenAI API model not found or no access (404)');
      console.error(`   Model: ${OPENAI_MODEL}`);
      console.error('   Check that you have access to this model in your OpenAI account');
    } else if (errorCode === 'insufficient_quota') {
      console.error('❌ OpenAI API insufficient quota');
      console.error('   Your OpenAI account has no credits remaining');
      console.error('   Add credits at: https://platform.openai.com/account/billing');
    } else {
      console.error('❌ Error generating AI suggestions:', {
        status,
        errorCode,
        message,
        model: OPENAI_MODEL,
        stack: error?.stack?.split('\n').slice(0, 3).join('\n'),
      });
    }
    
    // Return empty array on failure
    return [];
  }
}

/**
 * Generate a direct response to a customer message
 * @param {Array} conversationHistory - Array of message objects with sender and content
 * @param {string} customerMessage - The latest customer message
 * @returns {Promise<string|null>} AI-generated response or null on failure
 */
async function generateCustomerResponse(conversationHistory, customerMessage) {
  if (!openai) {
    console.log('⚠️ OpenAI client not initialized, skipping customer response. Check OPENAI_API_KEY in backend/.env');
    return null;
  }

  if (!customerMessage || typeof customerMessage !== 'string') {
    console.warn('Invalid customerMessage provided to generateCustomerResponse');
    return null;
  }

  try {
    // Last 5 messages for context
    const recentMessages = Array.isArray(conversationHistory)
      ? conversationHistory.slice(-5)
      : [];

    const contextMessages = recentMessages
      .filter(msg => msg && msg.sender && msg.content)
      .map(msg => ({
        role: msg.sender === 'customer' ? 'user' : 'assistant',
        content: msg.content,
      }));

    const systemPrompt = `You are a professional assistant for Eliche Radice LB, a luxury yacht maintenance company in Lebanon.

CRITICAL RULES:
1. NEVER handle emergencies - say \"A technician will contact you immediately\"
2. Keep responses brief (2-3 sentences max)
3. Professional, calm, reassuring tone
4. Never commit to pricing or timing
5. For urgent issues, say \"Our team will reach out shortly\"
6. Maintain luxury brand standards

You can:
- Answer general questions about services
- Provide basic information
- Acknowledge receipt
- Reassure customers

You MUST say \"Our team will contact you directly\" for:
- Emergencies
- Pricing
- Scheduling
- Technical diagnosis`;

    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...contextMessages,
        { role: 'user', content: customerMessage },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const response = completion.choices?.[0]?.message?.content?.trim();

    if (response) {
      console.log('✅ AI response generated:', response.substring(0, 80) + '...');
      return response;
    }

    return null;
  } catch (error) {
    const status = error?.status || error?.response?.status;
    const errorCode = error?.code || error?.response?.data?.error?.code;
    console.error('❌ AI error in generateCustomerResponse:', {
      status,
      errorCode,
      message: error?.message,
      model: OPENAI_MODEL,
    });
    return null;
  }
}

module.exports = {
  generateSuggestions,
  generateCustomerResponse,
};
