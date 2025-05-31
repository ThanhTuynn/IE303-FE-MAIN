import React, { useState, useEffect, useRef } from "react";
import Topbar from "../../component/TopbarComponent/TopbarComponent";
import FooterComponent from "../../component/FooterComponent/FooterComponent";
import {
    PhoneOutlined,
    MoreOutlined,
    SendOutlined,
    SearchOutlined,
    ReloadOutlined,
    RobotOutlined,
    UserOutlined,
    MessageOutlined,
} from "@ant-design/icons";
import "./ChattingPage.scss";
import Customer1 from "../../asset/customer1.jpg";
import Customer2 from "../../asset/customer2.jpg";
import { getAdminConversations, getConversationMessages, sendAdminMessage } from "../../../user/services/chatService";

const ChattingPage = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);
    const [error, setError] = useState(null);
    const chatMessagesRef = useRef(null);

    // Fetch conversations on component mount
    useEffect(() => {
        fetchConversations();
    }, []);

    // Fetch conversation messages when selected conversation changes
    useEffect(() => {
        if (selectedConversation) {
            fetchConversationMessages(selectedConversation.id);
        }
    }, [selectedConversation]);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const scrollToBottom = () => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    };

    const testApiConnection = async () => {
        console.log("=== TESTING API CONNECTION ===");
        try {
            const response = await fetch("http://localhost:8080/api/chat/admin/conversations");
            console.log("API Response status:", response.status);
            if (response.ok) {
                const data = await response.json();
                console.log("API Response data:", data);
                alert("API kết nối thành công!");
            } else {
                console.log("API Response error:", response.statusText);
                alert(`API error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error("API Connection failed:", error);
            alert(`Không thể kết nối API: ${error.message}`);
        }
    };

    const fetchConversations = async () => {
        try {
            console.log("=== FETCHING CONVERSATIONS ===");
            const data = await getAdminConversations();
            console.log("Conversations data:", data);
            setConversations(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching conversations:", error);
            setConversations([]);
            setError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc khởi động backend.");
        }
    };

    const fetchConversationMessages = async (conversationId) => {
        try {
            console.log("=== FETCHING MESSAGES ===");
            console.log("Conversation ID:", conversationId);
            setLoading(true);
            const data = await getConversationMessages(conversationId);
            console.log("Messages data:", data);
            setChatMessages(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setChatMessages([]);
            setError("Không thể tải tin nhắn. Vui lòng kiểm tra kết nối mạng.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() === "" || !selectedConversation) return;

        const tempMessage = {
            id: "temp_" + Date.now(),
            content: newMessage,
            isUser: false, // Admin message
            timestamp: new Date().toISOString(),
            isAdmin: true,
            sending: true,
        };

        setChatMessages((prev) => [...prev, tempMessage]);
        const messageContent = newMessage;
        setNewMessage("");

        try {
            console.log("=== SENDING ADMIN MESSAGE ===");
            console.log("Conversation ID:", selectedConversation.id);
            console.log("Message:", messageContent);

            const data = await sendAdminMessage({
                conversationId: selectedConversation.id,
                message: messageContent,
            });

            console.log("Send message response:", data);

            // Replace temp message with actual message
            setChatMessages((prev) =>
                prev.map((msg) =>
                    msg.id === tempMessage.id
                        ? {
                              ...data,
                              isAdmin: true,
                          }
                        : msg
                )
            );
            setError(null);
        } catch (error) {
            console.error("Error sending message:", error);
            setChatMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
            setError("Không thể gửi tin nhắn. Vui lòng thử lại.");
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return `${Math.floor(diffInHours * 60)} phút trước`;
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} giờ trước`;
        } else if (diffInHours < 48) {
            return "1 ngày trước";
        } else {
            return `${Math.floor(diffInHours / 24)} ngày trước`;
        }
    };

    const formatMessageTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const filteredConversations = conversations.filter((conv) => {
        const matchesSearch =
            conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesUnread = !showUnreadOnly || conv.unreadCount > 0;
        return matchesSearch && matchesUnread;
    });

    return (
        <div className="chatting-container">
            <Topbar title="Trò chuyện" />
            <div className="chatting-content">
                {/* Error Message */}
                {error && (
                    <div
                        className="error-message"
                        style={{
                            background: "#ffebee",
                            color: "#c62828",
                            padding: "10px",
                            borderRadius: "4px",
                            marginBottom: "10px",
                        }}
                    >
                        {error}
                        <button
                            onClick={() => setError(null)}
                            style={{ float: "right", background: "none", border: "none", cursor: "pointer" }}
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Phần danh sách tin nhắn bên trái */}
                <div className="message-list">
                    <div className="search-bar">
                        <div className="search-input">
                            <SearchOutlined />
                            <input
                                type="text"
                                placeholder="Tìm kiếm cuộc trò chuyện"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="read-status">
                            <span className="text-read-status">Chưa đọc</span>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={showUnreadOnly}
                                    onChange={(e) => setShowUnreadOnly(e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <button
                            onClick={fetchConversations}
                            className="refresh-btn"
                            style={{
                                background: "#f5f5f5",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                padding: "8px",
                                cursor: "pointer",
                                marginLeft: "10px",
                            }}
                        >
                            <ReloadOutlined />
                        </button>
                        <button
                            onClick={testApiConnection}
                            className="test-btn"
                            style={{
                                background: "#e3f2fd",
                                border: "1px solid #2196f3",
                                borderRadius: "4px",
                                padding: "8px",
                                cursor: "pointer",
                                marginLeft: "10px",
                                fontSize: "12px",
                                color: "#2196f3",
                            }}
                        >
                            Test API
                        </button>
                    </div>
                    <div className="message-details">
                        {filteredConversations.length === 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "300px",
                                    color: "#666",
                                    textAlign: "center",
                                }}
                            >
                                <UserOutlined style={{ fontSize: "32px", marginBottom: "16px", opacity: 0.5 }} />
                                <h4>Chưa có cuộc trò chuyện nào</h4>
                                <p style={{ fontSize: "14px", margin: "8px 0" }}>
                                    {error ? "Không thể tải dữ liệu từ server" : "Đang chờ khách hàng liên hệ"}
                                </p>
                                <button
                                    onClick={fetchConversations}
                                    style={{
                                        background: "#1890ff",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        padding: "8px 16px",
                                        cursor: "pointer",
                                        marginTop: "16px",
                                    }}
                                >
                                    Thử lại
                                </button>
                            </div>
                        ) : (
                            filteredConversations.map((conversation) => (
                                <div
                                    key={conversation.id}
                                    className={`message-item ${
                                        selectedConversation?.id === conversation.id ? "selected" : ""
                                    }`}
                                    onClick={() => setSelectedConversation(conversation)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="message-avatar">
                                        <img src={Customer1} alt="avatar-customer" />
                                        {conversation.chatType === "chatbot" && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    right: 0,
                                                    background: "#4caf50",
                                                    borderRadius: "50%",
                                                    width: "16px",
                                                    height: "16px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <RobotOutlined style={{ fontSize: "10px", color: "white" }} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="message-info">
                                        <div className="message-header">
                                            <span className="message-sender">
                                                {conversation.userName}
                                                {conversation.chatType === "chatbot" && (
                                                    <span
                                                        style={{ fontSize: "12px", color: "#666", marginLeft: "5px" }}
                                                    >
                                                        (Bot)
                                                    </span>
                                                )}
                                            </span>
                                            <span>
                                                <span className="message-time">
                                                    {formatTime(conversation.lastMessageTime)}
                                                </span>
                                                {conversation.unreadCount > 0 && (
                                                    <span className="unread-count">{conversation.unreadCount}</span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="message-content">{conversation.lastMessage}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Phần nội dung trò chuyện bên phải */}
                <div className="chat-area">
                    {selectedConversation ? (
                        <>
                            <div className="chat-header">
                                <div className="chat-avatar">
                                    <img src={Customer2} alt="avatar-customer" />
                                    {selectedConversation.chatType === "chatbot" && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                right: 0,
                                                background: "#4caf50",
                                                borderRadius: "50%",
                                                width: "20px",
                                                height: "20px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <RobotOutlined style={{ fontSize: "12px", color: "white" }} />
                                        </div>
                                    )}
                                </div>
                                <span className="chat-sender">
                                    {selectedConversation.userName}
                                    {selectedConversation.chatType === "chatbot" && (
                                        <span style={{ fontSize: "14px", color: "#666", marginLeft: "8px" }}>
                                            (AI Chatbot)
                                        </span>
                                    )}
                                </span>
                                <div className="chat-actions">
                                    <PhoneOutlined style={{ transform: "rotate(90deg)", display: "inline-block" }} />
                                    <MoreOutlined />
                                </div>
                            </div>
                            <div className="chat-messages" ref={chatMessagesRef}>
                                {loading && (
                                    <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                                        Đang tải tin nhắn...
                                    </div>
                                )}
                                {!loading && chatMessages.length === 0 && (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            height: "200px",
                                            color: "#666",
                                            textAlign: "center",
                                        }}
                                    >
                                        <MessageOutlined
                                            style={{ fontSize: "32px", marginBottom: "16px", opacity: 0.5 }}
                                        />
                                        <h4>Chưa có tin nhắn nào</h4>
                                        <p style={{ fontSize: "14px" }}>Hãy bắt đầu cuộc trò chuyện với khách hàng</p>
                                    </div>
                                )}
                                {chatMessages.map((msg) => (
                                    <div key={msg.id} className={`chat-message ${msg.isAdmin ? "sent" : "received"}`}>
                                        <div className="message-bubble">
                                            <span className="message-text">{msg.content}</span>
                                            <span className="message-time">
                                                {formatMessageTime(msg.timestamp)}
                                                {msg.sending && (
                                                    <span style={{ marginLeft: "5px", opacity: 0.7 }}>Đang gửi...</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="chat-input">
                                <button className="attach-btn">+</button>
                                <input
                                    type="text"
                                    placeholder={
                                        selectedConversation.chatType === "chatbot"
                                            ? "Tin nhắn sẽ được chuyển đến chatbot"
                                            : "Soạn tin nhắn"
                                    }
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                    disabled={loading}
                                />
                                <SendOutlined
                                    onClick={handleSendMessage}
                                    className={`send-icon ${newMessage.trim() ? "active" : ""}`}
                                    style={{ cursor: newMessage.trim() ? "pointer" : "not-allowed" }}
                                />
                            </div>
                        </>
                    ) : (
                        <div
                            className="no-conversation-selected"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "100%",
                                color: "#666",
                            }}
                        >
                            <UserOutlined style={{ fontSize: "48px", marginBottom: "16px" }} />
                            <h3>Chọn một cuộc trò chuyện để bắt đầu</h3>
                            <p>Chọn một cuộc trò chuyện từ danh sách bên trái để xem và trả lời tin nhắn.</p>
                        </div>
                    )}
                </div>
            </div>
            <FooterComponent />
        </div>
    );
};

export default ChattingPage;
