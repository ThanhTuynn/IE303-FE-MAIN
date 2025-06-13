import { API_CONFIG } from '../utils/config.js';

// API Service class để handle tất cả các API calls
class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.timeout = API_CONFIG.TIMEOUT;
    }

    // Helper method để build headers
    getHeaders(includeAuth = false) {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (includeAuth) {
            const token = localStorage.getItem('authToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(options.auth),
            ...options,
        };

        try {
            const response = await fetch(url, config);

            // Handle non-200 responses
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorData}`);
            }

            // Handle empty responses
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint, auth = false) {
        return this.request(endpoint, {
            method: 'GET',
            auth,
        });
    }

    // POST request
    async post(endpoint, data, auth = false) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            auth,
        });
    }

    // PUT request
    async put(endpoint, data, auth = false) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            auth,
        });
    }

    // PATCH request
    async patch(endpoint, data, auth = false) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
            auth,
        });
    }

    // DELETE request
    async delete(endpoint, auth = false) {
        return this.request(endpoint, {
            method: 'DELETE',
            auth,
        });
    }

    // Upload file (multipart/form-data)
    async uploadFile(endpoint, file, auth = true) {
        const url = `${this.baseURL}${endpoint}`;
        const formData = new FormData();
        formData.append('file', file);

        const headers = {};
        if (auth) {
            const token = localStorage.getItem('authToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('File upload failed:', error);
            throw error;
        }
    }
}

// Create singleton instance
const apiService = new ApiService();

// Authentication APIs
export const authAPI = {
    login: (credentials) => apiService.post('/users/login', credentials),
    register: (userData) => apiService.post('/users/register', userData),
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
    },
    getCurrentUser: () => apiService.get('/users/profile', true),
};

// Food APIs
export const foodAPI = {
    getAll: () => apiService.get('/foods'),
    getById: (id) => apiService.get(`/foods/${id}`),
    getCategories: () => apiService.get('/foods/categories'),
    create: (foodData) => apiService.post('/foods', foodData, true),
    update: (id, foodData) => apiService.put(`/foods/${id}`, foodData, true),
    delete: (id) => apiService.delete(`/foods/${id}`, true),
    uploadImage: (file) => apiService.uploadFile('/foods/upload', file, true),
};

// Order APIs
export const orderAPI = {
    create: (orderData) => apiService.post('/orders', orderData, true),
    getByUser: (userId) => apiService.get(`/orders/user/${userId}`, true),
    getById: (id) => apiService.get(`/orders/${id}`, true),
    updateStatus: (id, status) => apiService.put(`/orders/${id}/status`, { status }, true),
    getAll: () => apiService.get('/orders', true),
};

// Payment APIs
export const paymentAPI = {
    create: (paymentData) => apiService.post('/payments', paymentData, true),
    callback: (data) => apiService.post('/payments/callback', data),
    getByOrder: (orderId) => apiService.get(`/payments/order/${orderId}`, true),
};

// Chat APIs
export const chatAPI = {
    start: (sessionData) => apiService.post('/chat/start', sessionData),
    send: (messageData) => apiService.post('/chat/send', messageData),
    getHistory: (sessionId) => apiService.get(`/chat/history/${sessionId}`),
};

// User APIs
export const userAPI = {
    getProfile: (userId) => apiService.get(`/users/${userId}`, true),
    updateProfile: (userId, userData) => apiService.put(`/users/${userId}`, userData, true),
    getFavourites: (userId) => apiService.get(`/users/${userId}/favourites`, true),
    addFavourite: (userId, foodId) => apiService.post(`/users/${userId}/favourites/${foodId}`, {}, true),
    removeFavourite: (userId, foodId) => apiService.delete(`/users/${userId}/favourites/${foodId}`, true),
};

// Notification APIs
export const notificationAPI = {
    getByUser: (userId) => apiService.get(`/notifications/user/${userId}`, true),
    markAsRead: (notificationId) => apiService.patch(`/notifications/${notificationId}/read`, {}, true),
};

// Promotion APIs
export const promotionAPI = {
    getAll: () => apiService.get('/promotions'),
    getById: (id) => apiService.get(`/promotions/${id}`),
    create: (promotionData) => apiService.post('/promotions', promotionData, true),
    update: (id, promotionData) => apiService.put(`/promotions/${id}`, promotionData, true),
    delete: (id) => apiService.delete(`/promotions/${id}`, true),
};

// Checkout APIs
export const checkoutAPI = {
    calculate: (checkoutData) => apiService.post('/checkout/calculate', checkoutData),
    process: (checkoutData) => apiService.post('/checkout/process', checkoutData, true),
};

// Health check
export const healthAPI = {
    check: () => apiService.get('/../health'), // Backend health endpoint
    ping: () => apiService.get('/../'), // Backend root endpoint
};

export default apiService; 