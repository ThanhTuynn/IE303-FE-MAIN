import React, { useState, useEffect } from 'react';
import { Trash, CheckSquare, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const userData = localStorage.getItem('userData');

    if (!token || !userData) {
      alert("Please log in to view your cart.");
      navigate('/login');
      return;
    }

    try {
        const user = JSON.parse(userData);
        setUserId(user.id);
    } catch (e) {
        console.error("Failed to parse user data from localStorage:", e);
        alert("Error retrieving user data.");
        navigate('/login');
        return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        if (userId) {
            const response = await axios.get(`http://localhost:8080/api/carts/${userId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            setItems(response.data.items);
        }
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error("Error fetching cart:", err);
        alert("Failed to fetch cart data.");
      }
    };

    if (userId) {
       fetchCart();
    }

  }, [userId]);

  const handleQuantityChange = async (id, delta) => {
    const token = localStorage.getItem('jwtToken');
    // Optimistically update the state
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.foodId === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );

    const newQuantity = items.find(item => item.foodId === id).quantity + delta; // Calculate new quantity
    const finalQuantity = Math.max(1, newQuantity); // Ensure quantity is at least 1

    if (!userId || !token) {
        alert("User not logged in. Cannot update cart.");
        return;
    }

    try {
        // Call backend API to update the quantity
        await axios.put(`http://localhost:8080/api/carts/${userId}/items/${id}?quantity=${finalQuantity}`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(`Quantity updated for foodId ${id} to ${finalQuantity}`);

    } catch (err) {
        console.error("Error updating quantity on backend:", err);
        alert("Failed to update item quantity.");
        // Revert the optimistic update on error
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.foodId === id
              ? { ...item, quantity: item.quantity - delta } // Revert to previous quantity
              : item
          )
        );
    }
  };

  const handleCheckboxChange = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.foodId === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.foodId !== id));
  };

  const handleDiscountApply = () => {
    if (discountCode === 'DISCOUNT20') {
      setDiscount(20000);
    } else {
      setDiscount(0);
    }
  };

  const totalPrice = items.reduce(
    (total, item) => (item.checked ? total + item.price * item.quantity : total),
    0
  );

  const handleProceedToPayment = () => {
    navigate('/payment');
  };

  if (loading) {
    return <div className="text-center py-8">Loading cart...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error loading cart: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-kanit flex flex-col zoom-80">
      <div className="flex flex-col md:flex-row flex-grow p-8 bg-white">
        {/* Left – Cart Items */}
        <div className="w-full md:w-2/3 bg-white px-6 py-12 rounded-lg border border-gray-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-4xl font-bold text-black">Giỏ hàng của bạn</h2>
            <button
              onClick={() => navigate('/order-history')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-semibold shadow"
            >
              Lịch sử đơn hàng
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center text-gray-500 text-xl">Giỏ hàng của bạn trống.</div>
          ) : (
            items.map((item) => (
              <div
                key={item.foodId}
                className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6"
              >
                <div className="flex items-center">
                  <div onClick={() => handleCheckboxChange(item.foodId)} className="mr-4 cursor-pointer">
                    {item.checked ? <CheckSquare size={24} /> : <Square size={24} />}
                  </div>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <span className="text-lg w-40 truncate">{item.name}</span>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(item.foodId, -1)}
                    className="px-3 py-2 text-xl border rounded-lg"
                  >
                    −
                  </button>
                  <span className="mx-4 text-lg">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.foodId, 1)}
                    className="px-3 py-2 text-xl border rounded-lg"
                  >
                    +
                  </button>
                </div>

                <div className="text-lg">{(item.price * item.quantity).toLocaleString()}đ</div>

                <button
                  onClick={() => handleRemoveItem(item.foodId)}
                  className="text-red-600 hover:text-red-800 ml-4"
                >
                  <Trash size={24} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right – Cart Summary */}
        <div className="w-full md:w-1/3 bg-white px-6 py-12 rounded-lg md:ml-8 mt-8 md:mt-0 border border-gray-300">
          <h2 className="text-4xl font-bold text-black mb-6">Tóm tắt đơn hàng</h2>

          <div className="space-y-4">
            <div className="mt-4 flex items-center">
              <input
                type="text"
                placeholder="Mã giảm giá"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="w-2/3 py-2 px-4 border rounded-l-lg focus:outline-none"
              />
              <button
                onClick={handleDiscountApply}
                className="w-1/3 bg-black hover:bg-gray-800 text-white py-2 rounded-r-lg"
              >
                Áp dụng
              </button>
            </div>

            <div className="flex justify-between text-lg font-medium">
              <span>Tổng đơn hàng</span>
              <span>{totalPrice.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between text-lg font-medium">
              <span>Giảm giá</span>
              <span>-{discount.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Tổng thanh toán</span>
              <span>{(totalPrice - discount).toLocaleString()}đ</span>
            </div>
          </div>

          <button
            onClick={handleProceedToPayment}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-full mt-6 shadow-md"
          >
            Mua hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
