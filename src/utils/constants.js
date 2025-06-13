// API Endpoints Constants
export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        LOGIN: '/users/login',
        REGISTER: '/users/register',
        PROFILE: '/users/profile',
        LOGOUT: '/users/logout',
    },

    // Foods
    FOODS: {
        BASE: '/foods',
        CATEGORIES: '/foods/categories',
        BY_ID: (id) => `/foods/${id}`,
        UPLOAD: '/foods/upload',
    },

    // Orders
    ORDERS: {
        BASE: '/orders',
        BY_USER: (userId) => `/orders/user/${userId}`,
        BY_ID: (id) => `/orders/${id}`,
        UPDATE_STATUS: (id) => `/orders/${id}/status`,
    },

    // Payments
    PAYMENTS: {
        BASE: '/payments',
        CALLBACK: '/payments/callback',
        BY_ORDER: (orderId) => `/payments/order/${orderId}`,
        RETURN: '/payments/return',
        CANCEL: '/payments/cancel',
    },

    // Users
    USERS: {
        BASE: '/users',
        BY_ID: (id) => `/users/${id}`,
        FAVOURITES: (userId) => `/users/${userId}/favourites`,
        ADD_FAVOURITE: (userId, foodId) => `/users/${userId}/favourites/${foodId}`,
        REMOVE_FAVOURITE: (userId, foodId) => `/users/${userId}/favourites/${foodId}`,
    },

    // Chat
    CHAT: {
        START: '/chat/start',
        SEND: '/chat/send',
        HISTORY: (sessionId) => `/chat/history/${sessionId}`,
    },

    // Notifications
    NOTIFICATIONS: {
        BY_USER: (userId) => `/notifications/user/${userId}`,
        MARK_READ: (id) => `/notifications/${id}/read`,
    },

    // Promotions
    PROMOTIONS: {
        BASE: '/promotions',
        BY_ID: (id) => `/promotions/${id}`,
    },

    // Checkout
    CHECKOUT: {
        CALCULATE: '/checkout/calculate',
        PROCESS: '/checkout/process',
    },

    // Health
    HEALTH: {
        CHECK: '/health',
        PING: '/',
    },
};

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Please login to continue.',
    FORBIDDEN: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Internal server error. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful!',
    REGISTER_SUCCESS: 'Registration successful!',
    LOGOUT_SUCCESS: 'Logout successful!',
    ORDER_CREATED: 'Order created successfully!',
    PROFILE_UPDATED: 'Profile updated successfully!',
    FOOD_ADDED: 'Food added successfully!',
    FOOD_UPDATED: 'Food updated successfully!',
    FOOD_DELETED: 'Food deleted successfully!',
};

// User Roles
export const USER_ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    STAFF: 'STAFF',
};

// Order Status
export const ORDER_STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PREPARING: 'PREPARING',
    READY: 'READY',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
};

// Payment Status
export const PAYMENT_STATUS = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
};

// Food Categories (example)
export const FOOD_CATEGORIES = {
    APPETIZER: 'APPETIZER',
    MAIN_COURSE: 'MAIN_COURSE',
    DESSERT: 'DESSERT',
    BEVERAGE: 'BEVERAGE',
    SNACK: 'SNACK',
};

// Local Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'authToken',
    USER: 'user',
    USER_ID: 'userId',
    CART: 'cart',
    THEME: 'theme',
    LANGUAGE: 'language',
};

// Application Settings
export const APP_SETTINGS = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    DEBOUNCE_DELAY: 300,
    AUTO_LOGOUT_TIME: 30 * 60 * 1000, // 30 minutes
};

export default {
    API_ENDPOINTS,
    HTTP_STATUS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    USER_ROLES,
    ORDER_STATUS,
    PAYMENT_STATUS,
    FOOD_CATEGORIES,
    STORAGE_KEYS,
    APP_SETTINGS,
}; 