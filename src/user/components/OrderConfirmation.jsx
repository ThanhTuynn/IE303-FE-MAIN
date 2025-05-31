import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  if (!order) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-xl">No order information available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your order. We'll start preparing it right away.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          
          <div className="space-y-4">
            <div>
              <span className="font-medium">Order ID:</span>
              <span className="ml-2">{order.id}</span>
            </div>
            
            <div>
              <span className="font-medium">Status:</span>
              <span className="ml-2 capitalize">{order.status.toLowerCase()}</span>
            </div>

            <div>
              <span className="font-medium">Payment Method:</span>
              <span className="ml-2 capitalize">{order.paymentMethod.toLowerCase()}</span>
            </div>

            <div>
              <span className="font-medium">Delivery Address:</span>
              <p className="mt-1 text-gray-600">{order.deliveryAddress}</p>
            </div>

            {order.specialInstructions && (
              <div>
                <span className="font-medium">Special Instructions:</span>
                <p className="mt-1 text-gray-600">{order.specialInstructions}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.foodId} className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-600 ml-2">x {item.quantity}</span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/orders')}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 