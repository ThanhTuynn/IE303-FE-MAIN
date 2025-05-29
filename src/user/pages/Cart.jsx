import React, { useState } from 'react';
import { Trash, CheckSquare, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { id: 1, name: 'Bánh mì thịt', price: 20000, quantity: 1, checked: true },
    { id: 2, name: 'Bánh mì trứng', price: 20000, quantity: 1, checked: true },
    { id: 3, name: 'Bánh mì thập cẩm', price: 20000, quantity: 1, checked: true }
  ]);

  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleQuantityChange = (id, delta) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleCheckboxChange = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
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

          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-6 border-b border-gray-200 pb-6"
            >
              <div className="flex items-center">
                <div onClick={() => handleCheckboxChange(item.id)} className="mr-4 cursor-pointer">
                  {item.checked ? <CheckSquare size={24} /> : <Square size={24} />}
                </div>
                <img
                  src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746406267/banhmithapcam_gzfrza.webp"
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
                <span className="text-lg w-40 truncate">{item.name}</span>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(item.id, -1)}
                  className="px-3 py-2 text-xl border rounded-lg"
                >
                  −
                </button>
                <span className="mx-4 text-lg">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, 1)}
                  className="px-3 py-2 text-xl border rounded-lg"
                >
                  +
                </button>
              </div>

              <div className="text-lg">{item.price * item.quantity}đ</div>

              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-600 hover:text-red-800 ml-4"
              >
                <Trash size={24} />
              </button>
            </div>
          ))}
        </div>

        {/* Right – Cart Summary */}
        <div className="w-full md:w-1/3 bg-white px-6 py-12 rounded-lg ml-8 border border-gray-300">
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
