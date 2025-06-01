// orderService.js - API service for order management
const API_BASE_URL = 'http://localhost:8080/api';

export const orderService = {
    /**
     * Create order using new DTO endpoint
     * @param {Object} orderData - Order data object
     * @param {string} orderData.userId - User ID
     * @param {Array} orderData.items - Array of order items
     * @param {string} orderData.deliveryAddress - Delivery address
     * @param {string} orderData.paymentMethod - Payment method (e.g., "PayOS")
     * @param {string} orderData.specialInstructions - Optional special instructions
     * @returns {Promise<Object>} Created order response
     */
    async createOrder(orderData) {
        try {
            console.log('🛒 Creating order:', orderData);

            // Get authentication token if available
            const token = localStorage.getItem("jwtToken");

            const headers = {
                'Content-Type': 'application/json',
            };

            // Add auth header if token exists (though orders endpoint allows without auth)
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/orders/create`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(orderData)
            });

            console.log('Order creation response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Order creation failed:', errorText);
                throw new Error(`Order creation failed: ${response.status} - ${errorText}`);
            }

            const createdOrder = await response.json();
            console.log('✅ Order created successfully:', createdOrder);

            return {
                success: true,
                data: createdOrder,
                message: 'Order created successfully'
            };

        } catch (error) {
            console.error('❌ Order creation error:', error);
            return {
                success: false,
                data: null,
                message: error.message || 'Failed to create order'
            };
        }
    },

    /**
     * Get orders for a user
     * @param {string} userId - User ID
     * @returns {Promise<Object>} User orders
     */
    async getUserOrders(userId) {
        try {
            const token = localStorage.getItem("jwtToken");
            const headers = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch orders: ${response.status}`);
            }

            const orders = await response.json();
            return {
                success: true,
                data: orders,
                message: 'Orders fetched successfully'
            };

        } catch (error) {
            console.error('❌ Get orders error:', error);
            return {
                success: false,
                data: [],
                message: error.message || 'Failed to fetch orders'
            };
        }
    },

    /**
     * Format cart items for order creation
     * @param {Array} cartItems - Cart items from state/context
     * @returns {Array} Formatted order items
     */
    formatCartItemsForOrder(cartItems) {
        return cartItems.map(item => ({
            foodId: item.id || item.foodId || item._id,
            name: item.name,
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity),
            imageUrl: item.imageUrl || item.image || ''
        }));
    },

    /**
     * Create order from cart items
     * @param {Object} params - Order parameters
     * @param {string} params.userId - User ID
     * @param {Array} params.cartItems - Cart items
     * @param {string} params.deliveryAddress - Delivery address
     * @param {string} params.paymentMethod - Payment method
     * @param {string} params.specialInstructions - Special instructions
     * @returns {Promise<Object>} Order creation result
     */
    async createOrderFromCart({
        userId,
        cartItems,
        deliveryAddress,
        paymentMethod = 'PayOS',
        specialInstructions = ''
    }) {
        const orderData = {
            userId: userId.toString(),
            items: this.formatCartItemsForOrder(cartItems),
            deliveryAddress,
            paymentMethod,
            specialInstructions
        };

        return await this.createOrder(orderData);
    },

    /**
     * Create order from payment items (legacy support)
     * @param {Object} params - Order parameters
     * @param {string} params.userId - User ID
     * @param {Array} params.orderItems - Order items from payment page
     * @param {string} params.deliveryAddress - Delivery address  
     * @param {string} params.paymentMethod - Payment method
     * @param {string} params.specialInstructions - Special instructions
     * @returns {Promise<Object>} Order creation result
     */
    async createOrderFromPaymentItems({
        userId,
        orderItems,
        deliveryAddress,
        paymentMethod = 'PayOS',
        specialInstructions = ''
    }) {
        // Convert payment items format to order items format
        const formattedItems = orderItems.map(item => ({
            foodId: item.id || item.foodId || `food_${Date.now()}_${Math.random()}`,
            name: item.name,
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity),
            imageUrl: item.imageUrl || ''
        }));

        const orderData = {
            userId: userId.toString(),
            items: formattedItems,
            deliveryAddress,
            paymentMethod,
            specialInstructions
        };

        return await this.createOrder(orderData);
    }
};

export default orderService; 