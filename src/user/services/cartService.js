import axios from "axios";

const cartService = {
    // Clear all items from user's cart
    clearCart: async () => {
        try {
            // Check if there's a pending payment that might be cancelled
            const pendingPayment = localStorage.getItem("currentPayment");
            if (pendingPayment) {
                const paymentData = JSON.parse(pendingPayment);
                console.log("🔍 Found pending payment, checking status before clearing cart:", paymentData);

                // If payment is very recent (less than 30 seconds), wait a bit
                const paymentTime = new Date(paymentData.createdAt || Date.now());
                const timeDiff = Date.now() - paymentTime.getTime();

                if (timeDiff < 30000) { // Less than 30 seconds
                    console.log("⏰ Payment is very recent, waiting before cart clear...");
                    // Give time for proper status check
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            }

            const userData = localStorage.getItem("userData");
            const token = localStorage.getItem("jwtToken");

            if (!userData || !token) {
                console.log("No user data found, skipping cart clear");
                return { success: false, message: "No user data" };
            }

            const user = JSON.parse(userData);
            const userId = user.id || user._id;

            console.log("🛒 Clearing cart for user:", userId);

            // Get current cart items
            const cartResponse = await axios.get(`http://localhost:8080/api/carts/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const cartItems = cartResponse.data.items || [];
            console.log("📦 Cart items to clear:", cartItems.length);

            // If cart is already empty, don't proceed
            if (cartItems.length === 0) {
                console.log("ℹ️ Cart is already empty, no need to clear");
                return { success: true, clearedCount: 0 };
            }

            // Remove each item from cart
            for (const item of cartItems) {
                try {
                    await axios.delete(`http://localhost:8080/api/carts/${userId}/items/${item.foodId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    console.log("✅ Removed item from cart:", item.name);
                } catch (error) {
                    console.error("❌ Failed to remove item:", item.name, error);
                }
            }

            console.log("🎉 Cart cleared successfully!");

            // Trigger cart update event for header
            window.dispatchEvent(new Event("cartUpdated"));

            return { success: true, clearedCount: cartItems.length };

        } catch (error) {
            console.error("❌ Error clearing cart:", error);
            return { success: false, message: error.message };
        }
    },

    // Get cart items count for a user
    getCartCount: async (userId) => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token || !userId) return 0;

            const response = await axios.get(`http://localhost:8080/api/carts/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data && response.data.items) {
                return response.data.items.reduce((total, item) => total + item.quantity, 0);
            }
            return 0;
        } catch (error) {
            console.error("Error fetching cart count:", error);
            return 0;
        }
    },

    // Backup cart before payment
    backupCart: async () => {
        try {
            const userData = localStorage.getItem("userData");
            const token = localStorage.getItem("jwtToken");

            if (!userData || !token) {
                return { success: false, message: "No user data" };
            }

            const user = JSON.parse(userData);
            const userId = user.id || user._id;

            // Get current cart
            const cartResponse = await axios.get(`http://localhost:8080/api/carts/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const cartData = {
                items: cartResponse.data.items || [],
                timestamp: Date.now(),
                userId: userId
            };

            localStorage.setItem("cartBackup", JSON.stringify(cartData));
            console.log("💾 Cart backed up:", cartData.items.length, "items");

            return { success: true, itemCount: cartData.items.length };
        } catch (error) {
            console.error("❌ Error backing up cart:", error);
            return { success: false, message: error.message };
        }
    },

    // Restore cart from backup
    restoreCart: async () => {
        try {
            const backupData = localStorage.getItem("cartBackup");
            if (!backupData) {
                console.log("ℹ️ No cart backup found");
                return { success: false, message: "No backup found" };
            }

            const cartBackup = JSON.parse(backupData);
            const userData = localStorage.getItem("userData");
            const token = localStorage.getItem("jwtToken");

            if (!userData || !token) {
                return { success: false, message: "No user data" };
            }

            const user = JSON.parse(userData);
            const userId = user.id || user._id;

            // Check if backup is for same user and not too old (1 hour)
            const timeDiff = Date.now() - cartBackup.timestamp;
            if (cartBackup.userId !== userId || timeDiff > 3600000) {
                console.log("⚠️ Cart backup is invalid or too old");
                localStorage.removeItem("cartBackup");
                return { success: false, message: "Invalid backup" };
            }

            console.log("🔄 Restoring cart from backup:", cartBackup.items.length, "items");

            // Restore each item
            let restoredCount = 0;
            for (const item of cartBackup.items) {
                try {
                    const itemToAdd = {
                        foodId: item.foodId,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        imageUrl: item.imageUrl || item.image,
                    };

                    await axios.post(`http://localhost:8080/api/carts/${userId}/items`, itemToAdd, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    console.log("✅ Restored item:", item.name);
                    restoredCount++;
                } catch (error) {
                    console.error("❌ Failed to restore item:", item.name, error);
                }
            }

            // Clear backup after successful restore
            localStorage.removeItem("cartBackup");

            // Trigger cart update event
            window.dispatchEvent(new Event("cartUpdated"));

            console.log("🎉 Cart restored successfully! Items:", restoredCount);
            return { success: true, restoredCount };

        } catch (error) {
            console.error("❌ Error restoring cart:", error);
            return { success: false, message: error.message };
        }
    },

    // Clear cart backup
    clearBackup: () => {
        localStorage.removeItem("cartBackup");
        console.log("🗑️ Cart backup cleared");
    }
};

export default cartService; 