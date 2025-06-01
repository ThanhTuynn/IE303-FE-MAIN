import axios from 'axios';

// AI Recommendation Service API Base URL
const AI_API_BASE_URL = 'http://localhost:5000'; // Flask AI service

class AIRecommendationService {
    /**
     * Get user-based recommendations
     * @param {string} userId - User ID
     * @returns {Promise} Recommendations based on user order history
     */
    async getUserBasedRecommendations(userId) {
        try {
            console.log('🤖 Fetching user-based recommendations for user:', userId);

            const response = await axios.get(`${AI_API_BASE_URL}/recommend/${userId}`, {
                timeout: 10000, // 10 second timeout
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('✅ User-based recommendations response:', response.data);

            // ✅ FIX: Handle Flask API response format {status, data}
            if (response.data && response.data.status === 'success') {
                return {
                    success: true,
                    data: response.data.data || [], // Extract data from response.data.data
                    message: 'Recommendations fetched successfully'
                };
            } else {
                return {
                    success: false,
                    data: [],
                    message: response.data?.message || 'No recommendations available'
                };
            }
        } catch (error) {
            console.error('❌ Error fetching user-based recommendations:', error);

            if (error.code === 'ECONNREFUSED') {
                return {
                    success: false,
                    data: [],
                    message: 'AI recommendation service is not available'
                };
            }

            return {
                success: false,
                data: [],
                message: error.response?.data?.message || error.message || 'Failed to fetch recommendations'
            };
        }
    }

    /**
     * Get ingredient-based recommendations
     * @param {Array} ingredients - Array of ingredient names
     * @returns {Promise} Recommendations based on ingredients
     */
    async getIngredientBasedRecommendations(ingredients) {
        try {
            console.log('🥬 Fetching ingredient-based recommendations for:', ingredients);

            const response = await axios.post(`${AI_API_BASE_URL}/recommend/by-ingredients`, {
                ingredients: ingredients
            }, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('✅ Ingredient-based recommendations response:', response.data);

            // ✅ FIX: Handle Flask API response format {status, data}
            if (response.data && response.data.status === 'success') {
                return {
                    success: true,
                    data: response.data.data || [], // Extract data from response.data.data
                    message: 'Ingredient-based recommendations fetched successfully'
                };
            } else {
                return {
                    success: false,
                    data: [],
                    message: response.data?.message || 'No ingredient recommendations available'
                };
            }
        } catch (error) {
            console.error('❌ Error fetching ingredient-based recommendations:', error);

            if (error.code === 'ECONNREFUSED') {
                return {
                    success: false,
                    data: [],
                    message: 'AI recommendation service is not available'
                };
            }

            return {
                success: false,
                data: [],
                message: error.response?.data?.message || error.message || 'Failed to fetch ingredient recommendations'
            };
        }
    }

    /**
     * Get food-based recommendations (similar foods)
     * @param {string} foodId - Food ID
     * @returns {Promise} Recommendations based on similar foods
     */
    async getFoodBasedRecommendations(foodId) {
        try {
            console.log('🍔 Fetching food-based recommendations for food:', foodId);

            const response = await axios.get(`${AI_API_BASE_URL}/recommend/by-food/${foodId}`, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('✅ Food-based recommendations response:', response.data);

            // ✅ FIX: Handle Flask API response format {status, data}
            if (response.data && response.data.status === 'success') {
                return {
                    success: true,
                    data: response.data.data || [], // Extract data from response.data.data
                    message: 'Food-based recommendations fetched successfully'
                };
            } else {
                return {
                    success: false,
                    data: [],
                    message: response.data?.message || 'No food recommendations available'
                };
            }
        } catch (error) {
            console.error('❌ Error fetching food-based recommendations:', error);

            if (error.code === 'ECONNREFUSED') {
                return {
                    success: false,
                    data: [],
                    message: 'AI recommendation service is not available'
                };
            }

            return {
                success: false,
                data: [],
                message: error.response?.data?.message || error.message || 'Failed to fetch food recommendations'
            };
        }
    }

    /**
     * Search foods by keywords and get smart recommendations
     * @param {string} searchQuery - Search query
     * @returns {Promise} Smart search results with recommendations
     */
    async searchWithRecommendations(searchQuery) {
        try {
            // Extract potential ingredients from search query
            const ingredients = this.extractIngredientsFromQuery(searchQuery);

            if (ingredients.length > 0) {
                console.log('🔍 Search query contains ingredients:', ingredients);
                return await this.getIngredientBasedRecommendations(ingredients);
            } else {
                console.log('🔍 No ingredients detected in search query:', searchQuery);
                return {
                    success: true,
                    data: [],
                    message: 'No ingredients detected for AI recommendations'
                };
            }
        } catch (error) {
            console.error('❌ Error in smart search:', error);
            return {
                success: false,
                data: [],
                message: 'Search recommendations failed'
            };
        }
    }

    /**
     * Extract ingredient keywords from search query
     * @param {string} query - Search query
     * @returns {Array} Array of potential ingredients
     */
    extractIngredientsFromQuery(query) {
        // Common Vietnamese ingredients and food terms
        const ingredientKeywords = [
            'thịt', 'gà', 'bò', 'heo', 'tôm', 'cá', 'trứng',
            'rau', 'cải', 'húng', 'mùi', 'lá', 'hành', 'tỏi',
            'ớt', 'tương', 'nước mắm', 'mì', 'bún', 'phở',
            'cơm', 'bánh', 'chả', 'giò', 'nem', 'xôi',
            'nấm', 'đậu', 'măng', 'cà', 'chua', 'ngọt'
        ];

        const queryLower = query.toLowerCase();
        const foundIngredients = ingredientKeywords.filter(ingredient =>
            queryLower.includes(ingredient)
        );

        return foundIngredients;
    }

    /**
     * Check if AI service is available
     * @returns {Promise} Service health status
     */
    async checkServiceHealth() {
        try {
            const response = await axios.get(`${AI_API_BASE_URL}/health`, {
                timeout: 5000
            });

            return {
                success: true,
                available: true,
                message: 'AI service is healthy'
            };
        } catch (error) {
            console.warn('⚠️ AI recommendation service is not available:', error.message);
            return {
                success: false,
                available: false,
                message: 'AI service is not available'
            };
        }
    }
}

// Export singleton instance
export const aiRecommendationService = new AIRecommendationService();
export default aiRecommendationService; 