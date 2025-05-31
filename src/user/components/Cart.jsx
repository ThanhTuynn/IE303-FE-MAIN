import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = ({ userId }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/cart?userId=${userId}`);
      setCart(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setLoading(false);
    }
  };

  const updateQuantity = async (foodId, newQuantity) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/cart/items/${foodId}?userId=${userId}&quantity=${newQuantity}`
      );
      setCart(response.data);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (foodId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/cart/items/${foodId}?userId=${userId}`
      );
      setCart(response.data);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/cart?userId=${userId}`);
      setCart({ items: [], totalAmount: 0 });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const proceedToCheckout = () => {
    navigate('/checkout', { state: { cart } });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/menu')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 gap-4">
        {cart.items.map((item) => (
          <div key={item.foodId} className="flex items-center justify-between p-4 border rounded">
            <div className="flex items-center space-x-4">
              <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.foodId, item.quantity - 1)}
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.foodId, item.quantity + 1)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.foodId)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <div>
          <p className="text-xl font-semibold">Total: ${cart.totalAmount.toFixed(2)}</p>
        </div>
        <div className="space-x-4">
          <button
            onClick={clearCart}
            className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
          >
            Clear Cart
          </button>
          <button
            onClick={proceedToCheckout}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart; 