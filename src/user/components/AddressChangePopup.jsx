import React, { useState } from 'react';

const AddressChangePopup = () => {
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  const handleAddressChange = () => {
    // Handle logic to save changes, for example, make API call here
    console.log('Saved: ', { fullName, phoneNumber, address });
    setShowAddressPopup(false); // Close popup after saving
  };

  return (
    <>
      {/* Button to trigger popup */}
      <button onClick={() => setShowAddressPopup(true)} className="bg-blue-600 text-white py-2 px-4 rounded-lg">
        Thay đổi địa chỉ
      </button>

      {/* Address Change Popup */}
      {showAddressPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg w-96">
            <h3 className="text-2xl font-semibold mb-4">Thay đổi thông tin nhận hàng</h3>

            {/* Họ và tên */}
            <input
              type="text"
              placeholder="Họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border p-2 mb-4"
            />

            {/* Số điện thoại */}
            <input
              type="text"
              placeholder="Số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full border p-2 mb-4"
            />

            {/* Địa chỉ */}
            <input
              type="text"
              placeholder="Nhập địa chỉ mới"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border p-2 mb-4"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowAddressPopup(false)} // Close popup
                className="bg-gray-300 text-black py-2 px-4 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleAddressChange} // Save the changes
                className="bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddressChangePopup;
