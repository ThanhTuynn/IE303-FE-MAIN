const API_BASE_URL = 'http://localhost:8080/api';

export const paymentService = {
    // Create a new payment
    async createPayment(paymentData) {
        try {
            const response = await fetch(`${API_BASE_URL}/payments/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to create payment');
            }

            return result;
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    },

    // Get payment status by order code
    async getPaymentStatus(orderCode) {
        try {
            const response = await fetch(`${API_BASE_URL}/payments/status/${orderCode}`);
            const result = await response.json();

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
            const result = await response.json();

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
            const result = await response.json();

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

            const result = await response.json();

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