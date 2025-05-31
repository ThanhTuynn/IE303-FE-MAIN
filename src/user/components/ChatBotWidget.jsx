import React, { useState, useEffect, useRef } from "react";
import { X, MessageCircle, User, Bot, Send } from "lucide-react";
import { API_CONFIG, buildApiUrl } from "../../utils/config";
import { useNavigate } from "react-router-dom";
import {
    getConversationMessages,
    startConversation as startChatConversation,
    sendMessage as sendChatMessage,
} from "../services/chatService";

const ChatBotWidget = () => {
    const [open, setOpen] = useState(false);
    const [chatType, setChatType] = useState(null); // 'admin' | 'chatbot'
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const chatbotIcon = "https://res.cloudinary.com/dbr85jktp/image/upload/v1747658202/chatboticx_btdz3t.webp";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Polling for new messages when chatting with admin
    useEffect(() => {
        if (chatType === "admin" && conversationId) {
            const interval = setInterval(() => {
                fetchNewMessages();
            }, 3000); // Poll every 3 seconds
            return () => clearInterval(interval);
        }
    }, [chatType, conversationId]);

    const fetchNewMessages = async () => {
        if (!conversationId || chatType !== "admin") return;

        try {
            const newMessages = await getConversationMessages(conversationId);
            // Only update if we have new messages (compare by length or timestamp)
            if (newMessages.length > messages.length) {
                setMessages(newMessages);
            }
        } catch (error) {
            console.error("Error fetching new messages:", error);
            // Don't show error for polling failures to avoid spam
        }
    };

    const startConversation = async (type) => {
        try {
            setLoading(true);
            setError(null);

            const data = await startChatConversation({ chatType: type });
            setConversationId(data.conversationId);
            setChatType(type);

            // Set initial welcome message
            const welcomeMessage =
                type === "admin"
                    ? "Xin chào! Bạn đã kết nối với bộ phận hỗ trợ UniFoodie. Chúng tôi sẽ hỗ trợ bạn trong thời gian sớm nhất."
                    : "Xin chào! Tôi là chatbot của UniFoodie. Tôi có thể giúp bạn:\n• Tìm kiếm món ăn\n• Đặt hàng\n• Hỏi về khuyến mãi\n• Hỗ trợ đơn hàng\n\nBạn cần hỗ trợ gì?";

            setMessages([
                {
                    id: Date.now(),
                    content: welcomeMessage,
                    isUser: false,
                    timestamp: new Date().toISOString(),
                },
            ]);
        } catch (error) {
            console.error("Error starting conversation:", error);
            setError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || !conversationId || loading) return;

        if (input.length > API_CONFIG.CHAT_CONFIG.MAX_MESSAGE_LENGTH) {
            setError(`Tin nhắn không được vượt quá ${API_CONFIG.CHAT_CONFIG.MAX_MESSAGE_LENGTH} ký tự.`);
            return;
        }

        const userMessage = {
            id: Date.now(),
            content: input.trim(),
            isUser: true,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);
        setTyping(true);
        setError(null);

        try {
            // Gọi trực tiếp n8n webhook cho chatbot
            if (chatType === "chatbot") {
                console.log("=== N8N REQUEST DEBUG ===");
                console.log("N8N URL:", API_CONFIG.N8N_WEBHOOK_URL);

                const payload = {
                    sessionId: conversationId || "7eb5a424749c40abbc857a24e516ce01",
                    action: "sendMessage",
                    chatInput: userMessage.content,
                };
                console.log("Request payload:", JSON.stringify(payload, null, 2));

                try {
                    console.log("Sending fetch request...");
                    const response = await fetch(API_CONFIG.N8N_WEBHOOK_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    });

                    console.log("N8n response received:");
                    console.log("- Status:", response.status);
                    console.log("- Status Text:", response.statusText);
                    console.log("- Headers:", Object.fromEntries(response.headers.entries()));

                    if (!response.ok) {
                        throw new Error(`N8n HTTP error! status: ${response.status} ${response.statusText}`);
                    }

                    // Đọc response text trước
                    const responseText = await response.text();
                    console.log("Raw response text:", responseText);
                    console.log("Response length:", responseText.length);

                    let data = {};
                    if (responseText && responseText.trim()) {
                        try {
                            data = JSON.parse(responseText);
                            if (Array.isArray(data)) data = data[0];
                            // Nếu có trường output là string và có markdown JSON bên trong
                            if (typeof data.output === "string") {
                                // Ưu tiên tìm trong markdown ```json ... ```
                                const mdMatch = data.output.match(/```json([\s\S]*?)```/i);
                                let jsonStr = null;
                                if (mdMatch) {
                                    jsonStr = mdMatch[1];
                                } else {
                                    // Nếu không có markdown, tìm đoạn mảng hoặc object JSON
                                    const arrMatch = data.output.match(/\[([\s\S]*?)\]/);
                                    if (arrMatch) jsonStr = `[${arrMatch[1]}]`;
                                    else {
                                        const objMatch = data.output.match(/{[\s\S]*}/);
                                        if (objMatch) jsonStr = objMatch[0];
                                    }
                                }
                                if (jsonStr) {
                                    try {
                                        const extracted = JSON.parse(jsonStr);
                                        // Nếu là mảng món ăn (dạng gợi ý), set vào food_suggestions
                                        if (
                                            Array.isArray(extracted) &&
                                            extracted[0] &&
                                            (extracted[0]["Tên món"] || extracted[0]["name"])
                                        ) {
                                            data = {
                                                ...data,
                                                food_suggestions: extracted,
                                            };
                                        } else {
                                            // Gộp lại: giữ cả output text và suggested_items
                                            data = {
                                                ...data,
                                                ...extracted,
                                            };
                                        }
                                    } catch (e) {
                                        // Nếu parse lỗi thì giữ nguyên output text
                                    }
                                }
                            }
                        } catch (parseError) {
                            data = { output: responseText };
                        }
                    }

                    setTimeout(() => {
                        setMessages((prev) => [
                            ...prev,
                            data.food_suggestions
                                ? {
                                      id: Date.now() + 1,
                                      food_suggestions: data.food_suggestions,
                                      content: data.output,
                                      isUser: false,
                                      timestamp: new Date().toISOString(),
                                  }
                                : data.suggested_items
                                ? {
                                      id: Date.now() + 1,
                                      suggested_items: data.suggested_items,
                                      content: data.output,
                                      isUser: false,
                                      timestamp: new Date().toISOString(),
                                  }
                                : {
                                      id: Date.now() + 1,
                                      content:
                                          data.output ||
                                          data.response ||
                                          data.message ||
                                          "Cảm ơn bạn đã liên hệ! Tôi sẽ cố gắng giúp bạn.",
                                      isUser: false,
                                      timestamp: new Date().toISOString(),
                                  },
                        ]);
                        setTyping(false);
                    }, API_CONFIG.CHAT_CONFIG.TYPING_DELAY);
                } catch (fetchError) {
                    console.error("=== N8N FETCH ERROR ===");
                    console.error("Error type:", fetchError.name);
                    console.error("Error message:", fetchError.message);
                    console.error("Full error:", fetchError);

                    // Fallback response khi có lỗi
                    setTimeout(() => {
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: Date.now() + 1,
                                content:
                                    "Xin lỗi, chatbot hiện không khả dụng. Vui lòng thử lại sau hoặc liên hệ nhân viên hỗ trợ.",
                                isUser: false,
                                timestamp: new Date().toISOString(),
                            },
                        ]);
                        setTyping(false);
                    }, API_CONFIG.CHAT_CONFIG.TYPING_DELAY);
                }
            } else {
                // Gọi backend API cho admin chat
                console.log("Calling backend API:", buildApiUrl(API_CONFIG.ENDPOINTS.CHAT.SEND));

                const data = await sendChatMessage({
                    conversationId,
                    message: userMessage.content,
                });

                console.log("Backend response data:", data);

                setTimeout(() => {
                    setTyping(false);
                }, API_CONFIG.CHAT_CONFIG.TYPING_DELAY);
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setError(`Lỗi kết nối: ${error.message}`);

            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        content:
                            chatType === "admin"
                                ? "Xin lỗi, hiện tại không có nhân viên hỗ trợ trực tuyến. Vui lòng thử lại sau hoặc chọn AI Chatbot để được hỗ trợ ngay."
                                : "Xin lỗi, chatbot đang gặp sự cố. Vui lòng thử lại sau hoặc liên hệ nhân viên hỗ trợ.",
                        isUser: false,
                        timestamp: new Date().toISOString(),
                    },
                ]);
                setTyping(false);
            }, API_CONFIG.CHAT_CONFIG.TYPING_DELAY);
        } finally {
            setLoading(false);
        }
    };

    const resetChat = () => {
        setChatType(null);
        setConversationId(null);
        setMessages([]);
        setError(null);
        setTyping(false);
        setLoading(false);
    };

    const closeChat = () => {
        setOpen(false);
        // Keep chat state when closing, don't reset
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-kanit">
            {/* Chat Button */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                >
                    <MessageCircle className="w-7 h-7 text-white" />
                </button>
            )}

            {/* Chat Window */}
            {open && (
                <div className="mt-3 w-[380px] h-[520px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-slide-up">
                    {/* Header */}
                    <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={chatbotIcon} className="w-8 h-8 rounded-full" alt="UniFoodie" />
                            <div>
                                <div className="font-bold text-sm">UniFoodie Support</div>
                                <div className="text-xs opacity-90">
                                    {chatType === "admin"
                                        ? "Nhân viên hỗ trợ"
                                        : chatType === "chatbot"
                                        ? "AI Assistant"
                                        : "Chọn loại hỗ trợ"}
                                </div>
                            </div>
                        </div>
                        <button onClick={closeChat} className="hover:bg-red-700 p-1 rounded transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-3">
                            <div className="text-sm text-red-700">{error}</div>
                            <button
                                onClick={() => setError(null)}
                                className="text-xs text-red-500 hover:text-red-700 mt-1"
                            >
                                Đóng
                            </button>
                        </div>
                    )}

                    {/* Chat Type Selection */}
                    {!chatType && (
                        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Chọn loại hỗ trợ</h3>

                            <div className="space-y-4 w-full">
                                <button
                                    onClick={() => startConversation("admin")}
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center gap-3 transition-colors disabled:opacity-50"
                                >
                                    <User className="w-5 h-5" />
                                    <div className="text-left">
                                        <div className="font-semibold">Nhân viên hỗ trợ</div>
                                        <div className="text-sm opacity-90">Chat với nhân viên thực</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => startConversation("chatbot")}
                                    disabled={loading}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center gap-3 transition-colors disabled:opacity-50"
                                >
                                    <Bot className="w-5 h-5" />
                                    <div className="text-left">
                                        <div className="font-semibold">AI Chatbot</div>
                                        <div className="text-sm opacity-90">Trả lời tự động 24/7</div>
                                    </div>
                                </button>
                            </div>

                            {loading && (
                                <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
                                    Đang kết nối...
                                </div>
                            )}
                        </div>
                    )}

                    {/* Chat Messages */}
                    {chatType && (
                        <>
                            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                                                message.isUser
                                                    ? "bg-red-600 text-white rounded-br-sm"
                                                    : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                                            }`}
                                        >
                                            {message.food_suggestions ? (
                                                <div className="grid grid-cols-1 gap-3">
                                                    {message.food_suggestions.map((item, idx) => (
                                                        <div
                                                            key={(item["Tên món"] || item.name) + idx}
                                                            className="border rounded-lg p-3 mb-2 shadow hover:bg-gray-50 cursor-pointer transition flex items-center gap-3"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/product/${encodeURIComponent(
                                                                        item["Tên món"] || item.name
                                                                    )}`
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={item.image}
                                                                alt={item["Tên món"] || item.name}
                                                                className="w-16 h-16 object-cover rounded-md border"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="font-bold text-base text-red-600">
                                                                    {item["Tên món"] || item.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500 mb-1">
                                                                    Giá:{" "}
                                                                    <span className="font-semibold">
                                                                        {item["Giá"] || item.price} VNĐ
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : message.suggested_items ? (
                                                <div className="grid grid-cols-1 gap-3">
                                                    {message.suggested_items.map((item, idx) => (
                                                        <div
                                                            key={item.name + idx}
                                                            className="border rounded-lg p-3 mb-2 shadow hover:bg-gray-50 cursor-pointer transition"
                                                            onClick={() =>
                                                                navigate(`/product/${encodeURIComponent(item.name)}`)
                                                            }
                                                        >
                                                            <div className="font-bold text-base text-red-600">
                                                                {item.name}
                                                            </div>
                                                            <div className="text-sm text-gray-700 mb-1">
                                                                {item.description}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mb-1">
                                                                Giá:{" "}
                                                                <span className="font-semibold">{item.price} VNĐ</span>
                                                            </div>
                                                            <div className="text-xs text-gray-400">
                                                                Thành phần:{" "}
                                                                {item.ingredients && item.ingredients.join(", ")}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="whitespace-pre-wrap">{message.content}</div>
                                            )}
                                            <div
                                                className={`text-xs mt-1 ${
                                                    message.isUser ? "text-red-200" : "text-gray-500"
                                                }`}
                                            >
                                                {formatTime(message.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {typing && (
                                    <div className="flex justify-start">
                                        <div className="bg-white px-4 py-2 rounded-lg rounded-bl-sm shadow-sm">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                <div
                                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                    style={{ animationDelay: "0.1s" }}
                                                ></div>
                                                <div
                                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                    style={{ animationDelay: "0.2s" }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-3 border-t bg-white">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        placeholder="Nhập tin nhắn..."
                                        disabled={loading}
                                        maxLength={API_CONFIG.CHAT_CONFIG.MAX_MESSAGE_LENGTH}
                                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-red-500 disabled:opacity-50"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={loading || !input.trim()}
                                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                    <button
                                        onClick={resetChat}
                                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        Bắt đầu cuộc trò chuyện mới
                                    </button>
                                    <div className="text-xs text-gray-400">
                                        {input.length}/{API_CONFIG.CHAT_CONFIG.MAX_MESSAGE_LENGTH}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatBotWidget;
