// API Configuration
const isDevelopment = import.meta.env.MODE === 'development';

export const API_CONFIG = {
    BASE_URL: isDevelopment
        ? 'http://localhost:8080/api'
        : 'https://your-production-api.com/api', // Update with your production URL

    // N8N Webhook URL (từ n8n interface)
    N8N_WEBHOOK_URL: 'http://localhost:5678/webhook/577f3a96-e095-4764-a55c-baad9ed92617/chat',

    ENDPOINTS: {
        CHAT: {
            START: '/chat/start',
            SEND: '/chat/send',
            HISTORY: '/chat/history'
        },
        N8N: {
            WEBHOOK: '/n8n/webhook'
        }
    },

    TIMEOUT: 10000, // 10 seconds

    // Chat Configuration
    CHAT_CONFIG: {
        MAX_MESSAGE_LENGTH: 1000,
        TYPING_DELAY: 1000,
        AUTO_SCROLL_DELAY: 100
    }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export default API_CONFIG; 