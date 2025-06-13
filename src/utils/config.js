// API Configuration
const isDevelopment = import.meta.env.MODE === 'development';
const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

// Force production URL cho Vercel deployment
const getApiBaseUrl = () => {
    // Debug info
    console.log('Environment info:', {
        MODE: import.meta.env.MODE,
        isDevelopment,
        isLocalhost,
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL
    });

    // Nếu là localhost thì dùng localhost API
    if (isLocalhost) {
        return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    }

    // Nếu là production (Vercel) thì luôn dùng Railway API
    return import.meta.env.VITE_API_BASE_URL || 'https://unifoodiebe-production.up.railway.app/api';
};

export const API_CONFIG = {
    BASE_URL: getApiBaseUrl(),

    // N8N Webhook URL (từ n8n interface)
    N8N_WEBHOOK_URL: import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/577f3a96-e095-4764-a55c-baad9ed92617/chat',

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

// Debug log
console.log('🚀 API Configuration loaded:', {
    BASE_URL: API_CONFIG.BASE_URL,
    MODE: import.meta.env.MODE,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server'
});

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Utility function to generate unique session ID
export const generateSessionId = () => {
    // Generate random UUID-like string
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomStr}-${Math.random().toString(36).substring(2, 15)}`;
};

// Utility functions for session management
export const getStoredSessionId = (chatType) => {
    const key = `unifoodie_${chatType}_session`;
    return localStorage.getItem(key);
};

export const setStoredSessionId = (chatType, sessionId) => {
    const key = `unifoodie_${chatType}_session`;
    localStorage.setItem(key, sessionId);
};

export const clearStoredSessionId = (chatType) => {
    const key = `unifoodie_${chatType}_session`;
    localStorage.removeItem(key);
};

export default API_CONFIG; 