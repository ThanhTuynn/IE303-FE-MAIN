import React, { useState } from "react";
import Topbar from "../../component/TopbarComponent/TopbarComponent";
import FooterComponent from "../../component/FooterComponent/FooterComponent";
import {
  PhoneOutlined,
  MoreOutlined,
  SendOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import "./ChattingPage.scss";
import Customer1 from "../../asset/customer1.jpg";
import Customer2 from "../../asset/customer2.jpg";

const ChattingPage = () => {
  const messages = [
    {
      id: 1,
      sender: "Them en vặt",
      time: "42 phút trước",
      content:
        "Shop có ship ngoại làng đại học không ạ? Cấc khung giờ giao hàng khi nào thế!!",
    },
    {
      id: 2,
      sender: "Béo ăn KEM",
      time: "4:43 CH",
      content:
        "Shop có ship ngoại làng đại học không ạ? Cấc khung giờ giao hàng khi nào thế!!",
      unread: 1,
    },
    {
      id: 3,
      sender: "Béo ăn KEM",
      time: "3:26 SA",
      content:
        "Shop có ship ngoại làng đại học không ạ? Cấc khung giờ giao hàng khi nào thế!!",
      unread: 1,
    },
    {
      id: 4,
      sender: "Béo ăn KEM",
      time: "1 ngày trước",
      content:
        "Shop có ship ngoại làng đại học không ạ? Cấc khung giờ giao hàng khi nào thế!!",
    },
    {
      id: 5,
      sender: "Béo ăn KEM",
      time: "8 ngày trước",
      content:
        "Shop có ship ngoại làng đại học không ạ? Cấc khung giờ giao hàng khi nào thế!!",
    },
    {
      id: 6,
      sender: "Béo ăn KEM",
      time: "10 ngày trước",
      content:
        "Shop có ship ngoại làng đại học không ạ? Cấc khung giờ giao hàng khi nào thế!!",
    },
    {
      id: 7,
      sender: "Béo ăn KEM",
      time: "8 ngày trước",
      content:
        "Shop có ship ngoại làng đại học không ạ? Cấc khung giờ giao hàng khi nào thế!!",
    },
    {
      id: 8,
      sender: "Béo ăn KEM",
      time: "10 ngày trước",
      content:
        "Shop có ship ngoại làng đại học không ạ? Cấc khung giờ giao hàng khi nào thế!!",
    },
    {
      id: 9,
      sender: "Béo ăn KEM",
      time: "8 ngày trước",
      content:
        "Shop có ship ngoại làng đại học không ạ? Cấc khung giờ giao hàng khi nào thế!!",
    },
    {
      id: 10,
      sender: "Béo ăn KEM",
      time: "10 ngày trước",
      content:
        "Shop có ship ngoại làng đại học không ạ? Cấc khung giờ giao hàng khi nào thế!!",
    },
  ];

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "Béo ăn KEM",
      time: "00:30 SA",
      content: "Đại Béo chào sờpppp!!!!",
    },
    {
      id: 2,
      sender: "Béo ăn KEM",
      time: "00:31 SA",
      content:
        "Shop có ship ngoại làng đại học không ạ? Cấc khung giờ giao hàng khi nào thế!!",
    },
    {
      id: 3,
      sender: "Béo ăn KEM",
      time: "8:33 SA",
      content: "Mình cần đặt đồ ăn số lượng lớn giao liền àa",
    },
    {
      id: 4,
      sender: "Béo ăn KEM",
      time: "08:35 SA",
      content: "Bận căng đặt nhình giùm à, Để sốp liên hệ cho nèee",
      isSent: true,
    },
  ]);

  const [newMessage, setNewMessage] = useState(""); // Lưu nội dung tin nhắn mới

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return; // Không gửi tin nhắn rỗng

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newChatMessage = {
      id: chatMessages.length + 1,
      sender: "Bạn",
      time: currentTime,
      content: newMessage,
      isSent: true,
    };

    setChatMessages([...chatMessages, newChatMessage]); // Thêm tin nhắn mới vào danh sách
    setNewMessage(""); // Xóa nội dung trong ô nhập liệu
  };

  return (
    <div className="chatting-container">
      <Topbar title="Trò chuyện" />
      <div className="chatting-content">
        {/* Phần danh sách tin nhắn bên trái */}
        <div className="message-list">
          <div className="search-bar">
            <div className="search-input">
              <i className="icon-search"></i>
              <SearchOutlined />
              <input type="text" placeholder="Tìm kiếm" />
            </div>
            <div className="read-status">
              <span className="text-read-status">Đã đọc</span>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="message-details">
            {messages.map((message) => (
              <div key={message.id} className="message-item">
                <div className="message-avatar">
                  <img src={Customer1} alt="avatar-customer1" />
                </div>
                <div className="message-info">
                  <div className="message-header">
                    <span className="message-sender">{message.sender}</span>
                    <span>
                      <span className="message-time">{message.time}</span>
                      {message.unread && (
                        <span className="unread-count">{message.unread}</span>
                      )}
                    </span>
                  </div>
                  <div className="message-content">{message.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phần nội dung trò chuyện bên phải */}
        <div className="chat-area">
          <div className="chat-header">
            <div className="chat-avatar">
              <img src={Customer2} alt="avatar-customer2" />
            </div>
            <span className="chat-sender">Béo ăn KEM</span>
            <div className="chat-actions">
              <PhoneOutlined
                style={{ transform: "rotate(90deg)", display: "inline-block" }}
              />
              <MoreOutlined />
            </div>
          </div>
          <div className="chat-messages">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message ${msg.isSent ? "sent" : "received"}`}
              >
                <div className="message-bubble">
                  <span className="message-text">{msg.content}</span>
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <button className="attach-btn">+</button>
            <input
              type="text"
              placeholder="Soạn tin nhắn"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)} // Cập nhật nội dung tin nhắn
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} // Gửi tin nhắn khi nhấn Enter
            />
            <SendOutlined onClick={handleSendMessage}  className={`send-icon ${newMessage.trim() ? "active" : ""}`}/>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default ChattingPage;
