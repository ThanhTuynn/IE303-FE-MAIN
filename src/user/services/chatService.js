// Chat service for FE - call BE chat endpoints

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Generate anonymous user ID if not exists
const getOrCreateUserId = () => {
    let userId = localStorage.getItem('chatUserId');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chatUserId', userId);
    }
    return userId;
};

// Generate user name for anonymous user
const getUserName = () => {
    let userName = localStorage.getItem('chatUserName');
    if (!userName) {
        const userId = getOrCreateUserId();
        userName = 'Khách hàng ' + userId.substring(5, 13); // Take part of userId for display
        localStorage.setItem('chatUserName', userName);
    }
    return userName;
};

export async function startConversation({ chatType, userId = null, userName = null }) {
    const actualUserId = userId || getOrCreateUserId();
    const actualUserName = userName || getUserName();

    console.log('Starting conversation:', { chatType, userId: actualUserId, userName: actualUserName });

    const res = await fetch(`${BASE_URL}/api/chat/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chatType,
            userId: actualUserId,
            userName: actualUserName
        }),
    });
    if (!res.ok) throw new Error(`Failed to start conversation: ${res.status}`);
    return res.json();
}

export async function sendMessage({ conversationId, message }) {
    console.log('Sending message:', { conversationId, message });

    const res = await fetch(`${BASE_URL}/api/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message }),
    });
    if (!res.ok) throw new Error(`Failed to send message: ${res.status}`);
    return res.json();
}

// Admin APIs
export async function getAdminConversations() {
    console.log('Fetching admin conversations');

    const res = await fetch(`${BASE_URL}/api/chat/admin/conversations`);
    if (!res.ok) throw new Error(`Failed to fetch conversations: ${res.status}`);
    return res.json();
}

export async function getConversationMessages(conversationId) {
    console.log('Fetching messages for conversation:', conversationId);

    const res = await fetch(`${BASE_URL}/api/chat/admin/conversations/${conversationId}/messages`);
    if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
    return res.json();
}

export async function sendAdminMessage({ conversationId, message }) {
    console.log('Sending admin message:', { conversationId, message });

    const res = await fetch(`${BASE_URL}/api/chat/admin/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message }),
    });
    if (!res.ok) throw new Error(`Failed to send admin message: ${res.status}`);
    return res.json();
}

// Utility functions
export const getChatUserId = getOrCreateUserId;
export const getChatUserName = getUserName; 