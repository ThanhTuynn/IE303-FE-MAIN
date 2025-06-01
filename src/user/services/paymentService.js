const API_BASE_URL = 'http://localhost:8080/api';

export const paymentService = {
    // Create a new payment
    async createPayment(paymentData) {
        try {
            console.log('Sending payment request to:', `${API_BASE_URL}/payments/create`);
            console.log('Payment data:', paymentData);

            // Get authentication token (optional for payments)
            const token = localStorage.getItem("jwtToken");
            console.log('JWT Token:', token ? `${token.substring(0, 20)}...` : 'No token found');

            const headers = {
                'Content-Type': 'application/json',
            };

            // Note: Payment endpoints don't require authentication
            // but we can still send token if available for logging purposes
            if (token) {
                console.log('Token available but not required for payment endpoint');
                // headers['Authorization'] = `Bearer ${token}`;  // Commented out since not required
            }

            console.log('Request headers:', headers);
            console.log('Request body:', JSON.stringify(paymentData));

            const response = await fetch(`${API_BASE_URL}/payments/create`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(paymentData),
            });

            console.log('Response status:', response.status);
            console.log('Response statusText:', response.statusText);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            // Check if response has content
            const responseText = await response.text();
            console.log('Response text length:', responseText.length);
            console.log('Response text:', responseText);

            if (!responseText || responseText.trim() === '') {
                throw new Error(`Server returned empty response. Status: ${response.status} ${response.statusText}`);
            }

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (jsonError) {
                console.error('JSON parsing error:', jsonError);
                console.error('Raw response:', responseText);
                throw new Error(`Invalid JSON response from server. Status: ${response.status}. Response: ${responseText.substring(0, 200)}`);
            }

            if (!response.ok) {
                throw new Error(result.message || `HTTP ${response.status}: Failed to create payment`);
            }

            return result;
        } catch (error) {
            console.error('Error creating payment:', error);

            // More specific error handling
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Cannot connect to payment server. Please check if the backend is running.');
            }

            throw error;
        }
    },

    // Get payment status by order code
    async getPaymentStatus(orderCode) {
        try {
            const response = await fetch(`${API_BASE_URL}/payments/status/${orderCode}`);

            const responseText = await response.text();
            if (!responseText) {
                throw new Error('Server returned empty response');
            }

            const result = JSON.parse(responseText);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to get payment status');
            }

            return result;
        } catch (error) {
            console.error('Error getting payment status:', error);
            throw error;
        }
    },

    // Get payment by order ID
    async getPaymentByOrderId(orderId) {
        try {
            const response = await fetch(`${API_BASE_URL}/payments/order/${orderId}`);

            const responseText = await response.text();
            if (!responseText) {
                throw new Error('Server returned empty response');
            }

            const result = JSON.parse(responseText);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to get payment by order ID');
            }

            return result;
        } catch (error) {
            console.error('Error getting payment by order ID:', error);
            throw error;
        }
    },

    // Get payments by status
    async getPaymentsByStatus(status) {
        try {
            const response = await fetch(`${API_BASE_URL}/payments/status?status=${status}`);

            const responseText = await response.text();
            if (!responseText) {
                throw new Error('Server returned empty response');
            }

            const result = JSON.parse(responseText);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to get payments by status');
            }

            return result;
        } catch (error) {
            console.error('Error getting payments by status:', error);
            throw error;
        }
    },

    // Verify payment webhook (for testing purposes)
    async verifyPayment(orderCode, transactionData) {
        try {
            const response = await fetch(`${API_BASE_URL}/payments/webhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderCode,
                    ...transactionData,
                }),
            });

            const responseText = await response.text();
            if (!responseText) {
                throw new Error('Server returned empty response');
            }

            const result = JSON.parse(responseText);

            if (!response.ok) {
                throw new Error(result.message || 'Failed to verify payment');
            }

            return result;
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    }
};

export default paymentService; 